const jwt = require("jsonwebtoken");
const userSocketMap = new Map();
const messages = require("../models/messages");
const { fn, col } = require("sequelize");
const fetchMoodFromConversation = require("../services/mistralService");
const {
  standardizeMood,
  standardizeSummary,
  standardizeRepliesForUser1,
  standardizeRepliesForUser2,
} = require("../services/mistralFallback");
const {
  extractMood,
  extractSummary,
  extractSuggestedReplies,
} = require("../services/mistralParser");

module.exports = function (io) {
  io.on("connection", (socket) => {
    // this socket is different than socket from frontend, they are two end points of a single pipeline. one represent backend other represent frontend client, socket.id is given by backend serve, we are not geting it from front end
    console.log("New Client connected", socket.id);

    socket.on("register", (token) => {
      try {
        const decoded = jwt.verify(token, "secretkeyitcanbeanything");
        const userId = decoded.userid;
        const userName = decoded.username;
        socket.userId = userId;
        userSocketMap.set(userId, { username: userName, socketId: socket.id });
        //console.log(userSocketMap);
        broadcastOnlineUsers();
      } catch (err) {
        console.log(err);
      }
    });
    function broadcastOnlineUsers() {
      const onlineUsers = Array.from(userSocketMap.entries()).map(
        ([userId, { username, socketId }]) => ({
          userId,
          username,
          socketId,
        })
      );
      console.log(onlineUsers);
      io.emit("onlineusers", onlineUsers);
    }

    socket.on("getonlineusers", () => {
      const onlineUsers = Array.from(userSocketMap.entries()).map(
        ([userId, { username, socketId }]) => ({
          userId,
          username,
          socketId,
        })
      );
      socket.emit("onlineusers", onlineUsers);
    });

    socket.on("chat_message", async ({ to, data }) => {
      const from = socket.userId;

      if (!from || !to || !data.message) {
        return;
      }
      await messages.create({
        chat_id: data.chatboxId,
        sender_id: from,
        message: data.message,
      });
      const receiver = userSocketMap.get(to);
      const receiverdata = {
        message: data.message,
        currentchatbox: data.chatboxId,
      };
      if (receiver) {
        io.to(receiver.socketId).emit("receive_msg", receiverdata);
      }
    });

    socket.on("get_latest_messages", async () => {
      // Step 1: get chatbox_ids with their latest message time
      const latestPerChatbox = await messages.findAll({
        attributes: [
          "chat_id",
          [fn("MAX", col("createdAt")), "lastMessageTime"],
        ],
        group: ["chat_id"],
      });

      // Step 2: For each chatbox_id fetch the last message (with the timestamp)
      const lastMessages = await Promise.all(
        latestPerChatbox.map(async (entry) => {
          const chatboxId = entry.get("chat_id");
          const lastTime = entry.get("lastMessageTime");

          return await messages.findOne({
            where: {
              chat_id: chatboxId,
              createdAt: lastTime,
            },
          });
        })
      );
      const data = lastMessages.map((obj) => {
        return {
          chatboxId: obj.dataValues.chat_id,
          messages: obj.dataValues.message,
          sender_id: obj.dataValues.sender_id,
        };
      });
      socket.emit("get_latest_messages", data);
    });

    socket.on("get_all_messages_of_this_user", async (chatbox_id) => {
      const result = await messages.findAll({ where: { chat_id: chatbox_id } });
      const msgs = result.map((obj) => {
        return {
          messages: obj.dataValues.message,
          sender_id: obj.dataValues.sender_id,
        };
      });
      const data = { chatbox_id, msgs };
      socket.emit("get_all_messages_of_this_user", data);
    });

    socket.on(
      "conversationsBatch",
      async ({
        cyclebatchobject,
        previous_mood_summary,
        selectedUserId,
        selectedChatboxId,
      }) => {
        function formatNestedCycles(cycles) {
          return cycles
            .flat() // Flatten all cycles into one array
            .map((msg) => {
              const speaker =
                msg.sender.toLowerCase() === "user1" ? "User1" : "User2";
              return `${speaker}: ${msg.text}`;
            })
            .join("\n");
        }
        const recentconversations = formatNestedCycles(cyclebatchobject);
        // console.log(recentconversations);
        // console.log(previous_mood_summary);
        const result = await fetchMoodFromConversation(
          recentconversations,
          previous_mood_summary
        );
        // console.log("result:", result);

        const extractedMood = extractMood(result);
        const extractedSummary = extractSummary(result);
        const extractedSuggestedRepliesuser1 = extractSuggestedReplies(
          result,
          "User1"
        );
        const extractedSuggestedRepliesuser2 = extractSuggestedReplies(
          result,
          "User2"
        );
        // console.log("1:", extractedMood);
        // console.log("2:", extractedSummary);
        // console.log("3", extractedSuggestedRepliesuser1);
        // console.log("4:", extractedSuggestedRepliesuser2);

        const mood = standardizeMood(extractedMood);
        // console.log("5:", mood);
        const summary = standardizeSummary(extractedSummary);
        // console.log("6:", summary);
        const repliesUser1 = standardizeRepliesForUser1(
          extractedSuggestedRepliesuser1
        );
        const repliesUser2 = standardizeRepliesForUser2(
          extractedSuggestedRepliesuser2
        );

        // console.log(repliesUser1);
        // console.log(repliesUser2);
        const themeData_user1 = {
          mood: mood,
          summary: summary,
          suggestedreply: repliesUser1,
          chatboxId: selectedChatboxId,
        };

        const themeData_user2 = {
          mood: mood,
          summary: summary,
          suggestedreply: repliesUser2,
          chatboxId: selectedChatboxId,
        };

        socket.emit("themeUpdate", themeData_user1);
        const receiver = userSocketMap.get(selectedUserId);
        if (receiver) {
          io.to(receiver.socketId).emit("themeUpdate", themeData_user2);
        }
      }
    );

    socket.on("disconnect", () => {
      const userId = socket.userId;
      if (userId) {
        userSocketMap.delete(userId);
        broadcastOnlineUsers();
        io.emit("resetcycle", userId);

        console.log("client disconnected", userId);
      }
    });
  });
};

// const text = `
// User1: i am also great thanks for asking hi
// User2: hello
// User1: waht you doing
// User2: nothing
// User1: great
// User2: i am alos fine thanks
// User1: why thanks
// User2: just casually`;

// async function test() {
//   const conversation = text;
//   const previous_mood_summary = {
//     mood: "calm",
//     summary: "Conversation was stable with no strong emotion",
//   };
//   const result = await fetchMoodFromConversation(
//     conversation,
//     previous_mood_summary
//   );
//   console.log(result);
//   const extractedMood = extractMood(result);
//   console.log(extractedMood);
//   const extractedSummary = extractSummary(result);
//   console.log(extractedSummary);
//   const extractedSuggestedRepliesuser1 = extractSuggestedReplies(
//     result,
//     "User1"
//   );
//   const extractedSuggestedRepliesuser2 = extractSuggestedReplies(
//     result,
//     "User2"
//   );

//   const repliesUser1 = standardizeRepliesForUser1(
//     extractedSuggestedRepliesuser1
//   );
//   const repliesUser2 = standardizeRepliesForUser2(
//     extractedSuggestedRepliesuser2
//   );
//   console.log(repliesUser1);
//   console.log(repliesUser2);
//   return result;
// }

// test();

const result = `Mood: sad
Summary: User2 expressed their disappointment in failing an exam, User1 offered words of encouragement.

SuggestedReplies for User1:
I believe in you.
You can do better next time.
Want to study together for the next exam?
Don't be too hard on yourself.
You're still learning and growing.

SuggestedReplies for User2:
I appreciate your support.
I'll try my best to do better next time.
Thank you for offering to study with me.
I'm trying to stay positive.
I know I can improve.
`;

// const extractedMood = extractMood(result);
// const extractedSummary = extractSummary(result);
// const extractedSuggestedRepliesuser1 = extractSuggestedReplies(
//   result,
//   "User 1"
// );
// const extractedSuggestedRepliesuser2 = extractSuggestedReplies(
//   result,
//   "User 2"
// );
// console.log("1:", extractedMood);
// console.log("2:", extractedSummary);
// console.log("3", extractedSuggestedRepliesuser1);
// console.log("4:", extractedSuggestedRepliesuser2);
