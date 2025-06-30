import { FaUserCircle } from "react-icons/fa";
import { FaUserGroup } from "react-icons/fa6";
import { BsFillCaretUpFill } from "react-icons/bs";
import { FaCircle } from "react-icons/fa";
import OnlineUser from "./onlineUser";
import socket from "../socket/socket";
import { useRef, useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { onlineUsersSliceAction } from "../store/onlineUsersSlice";
import ChatBox from "./ChatBox";
import { chatboxSliceSliceAction } from "../store/chatboxSlice";
import StickerRenderer from "./StickerRenderer";

function ChatWindow({ inputRef }) {
  function parseJwt(token) {
    var base64Url = token.split(".")[1];
    var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    var jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );

    return JSON.parse(jsonPayload);
  }
  const token = localStorage.getItem("token");
  const currentuserid = parseJwt(token).userid;
  const { onlineUsers, selectedUserName, selectedUserId, chatboxId } =
    useSelector((store) => store.onlineUsers);
  const dispatch = useDispatch();

  const selectedChatboxId = useSelector((store) => store.onlineUsers.chatboxId);
  const chatboxes = useSelector((store) => store.chatbox);
  const chatbox = chatboxes.find((box) => box.chatboxId === selectedChatboxId);

  const theme = chatbox ? `theme_${chatbox.current_theme}` : "theme_neutral";

  const HandleSendMessage = (e) => {
    // e.preventDefault();
    const message = inputRef.current.value;
    socket.emit("chat_message", {
      to: selectedUserId,
      data: { message: message, chatboxId: chatboxId },
    });
    const uniqueChatId = [currentuserid, selectedUserId].sort().join("_");
    dispatch(chatboxSliceSliceAction.addNewChatbox(uniqueChatId));
    dispatch(
      chatboxSliceSliceAction.addMessage({
        chatboxId: chatboxId,
        message: message,
        type: "sent",
      })
    );
    dispatch(
      chatboxSliceSliceAction.changeCycleTurn({
        chatboxId: chatboxId,
        type: "sent",
      })
    );
    inputRef.current.value = "";
  };
  useEffect(() => {
    if (!socket) return;
    socket.on("receive_msg", (receiverdata) => {
      dispatch(
        chatboxSliceSliceAction.addNewChatbox(receiverdata.currentchatbox)
      );
      dispatch(
        chatboxSliceSliceAction.addMessage({
          chatboxId: receiverdata.currentchatbox,
          message: receiverdata.message,
          type: "recieved",
        })
      );

      dispatch(
        chatboxSliceSliceAction.changeCycleTurn({
          chatboxId: receiverdata.currentchatbox,
          type: "recieved",
        })
      );
    });
    socket.on("onlineusers", (onlineusers) => {
      dispatch(onlineUsersSliceAction.setOnlineUsers(onlineusers));
    });

    socket.on("themeUpdate", (themeData) => {
      dispatch(chatboxSliceSliceAction.setcurrent_theme(themeData));
      dispatch(chatboxSliceSliceAction.setprevious_mood_summary(themeData));
      dispatch(
        onlineUsersSliceAction.setcurrent_user_suggested_replies(
          themeData.suggestedreply
        )
      );
    });

    socket.on("resetcycle", (userId) => {
      const chatbox_id = [currentuserid, userId].sort().join("_");
      dispatch(chatboxSliceSliceAction.resetCycle(chatbox_id));
    });

    return () => {
      socket.off("receive_msg");
      socket.off("onlineusers");
      socket.off("themeUpdate");
    };
  }, [socket]);

  return (
    <>
      <div className="componentgrid">
        <div className="onlineuserscontainer">
          <StickerRenderer theme={theme} count={6}></StickerRenderer>
          <div className="onlineuserheader">
            <span className="">
              <FaUserGroup size={30} style={{ marginRight: "10px" }} /> Online
              Users <FaCircle size={10} style={{ color: "#03fc45" }} />
            </span>
          </div>
          <div className="onlineusers">
            {onlineUsers.length <= 1 ? (
              <div>No friends are online, invite someone to chat!</div>
            ) : null}

            {onlineUsers.map((onlineuser) => {
              return <OnlineUser data={onlineuser}></OnlineUser>;
            })}
          </div>
        </div>
        <div className="chatwindowcontainer">
          <StickerRenderer theme={theme} count={10}></StickerRenderer>
          <div className="chattinguser">
            <span className="chattingusericon">
              <FaUserCircle size={30} />
            </span>
            <span className="chattingusername">
              {" "}
              {!selectedUserName
                ? "Select a user to start chatting."
                : selectedUserName}
            </span>
            <span className="chattingusertyping"> </span>
          </div>

          <div className="chatboxcontainer">
            <ChatBox></ChatBox>
          </div>
          <div className="input-group sendbutton">
            <input
              type="text"
              class="form-control form_input_text"
              ref={inputRef}
              placeholder="Type your message here..."
            />
            <button
              class="btn  send_button_cover"
              type="button"
              id="button-addon2"
              onClick={HandleSendMessage}
            >
              <BsFillCaretUpFill size={30} className="send_button" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default ChatWindow;
