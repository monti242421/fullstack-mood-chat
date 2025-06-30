const fetchMoodFromConversation = require("./mistralService");

// async function test() {
//   const conversation = `User2: mujhe dosti karni he
// User1: ye dosti dosti kya he ye dosti dosti
// User2: kya
// User1: ek bar jise nikal ke fek diya to fek diya
// User2: wow
// User1: kyu karo me tujhse dosti aukat jahtu shakal jhatu
// User2: huh
// User1: bhag ja yaha se`;
//   const previous_mood_summary = {
//     mood: "calm",
//     summary: "Conversation was stable with no strong emotion",
//   };
//   const result = await fetchMoodFromConversation(
//     conversation,
//     previous_mood_summary
//   );
//   console.log(result);
// }
exports.extractMood = (text) => {
  try {
    // Check if text is a valid string
    if (!text || typeof text !== "string") {
      return null;
    }

    // Match "MOOD:" followed by optional whitespace, then capture until a newline, end of string, or the next section
    const moodRegex = /MOOD:\s*([^\n]+?)(?=\n|SUMMARY:|SUGGESTEDREPLIES|$)/i;
    const match = text.match(moodRegex);
    if (!match) {
      return null;
    }

    // Ensure the captured mood is a non-empty string
    const mood = match[1].trim();
    return mood.length > 0 ? mood : null;
  } catch (err) {
    console.log(err);
    return null;
  }
};

// const Mood = extractMood(`
// Mood: angry

// Summary: User1 has become agitated and unfriendly in response to User2's request for friendship.

// SuggestedReplies for User1:
// I don't think we can be friends.
// I don't want to talk to you anymore.
// I don't need any more friends.
// I don't like you.
// I don't want to be friends with you.

// SuggestedReplies for User2:
// I'm sorry if I upset you.
// I didn't mean to offend you.
// I was just trying to be friendly.
// I didn't realize you felt that way.
// I'll leave you alone now.`);

exports.extractSummary = (text) => {
  try {
    const summaryRegex = /SUMMARY:\s*(.+?)(?=\n\n|\nSUGGESTEDREPLIES|$)/i;
    const match = text.match(summaryRegex);
    return match ? match[1].trim() : null;
  } catch (err) {
    console.log(err);
    return null;
  }
};

// const Summary = extractSummary(`
// Mood: angry

// Summary: User1 has become agitated and unfriendly in response to User2's request for friendship.

// SuggestedReplies for User1:
// 1. I don't think we can be friends.
// 2. I don't want to talk to you anymore.
// 3. I don't need any more friends.
// 4. I don't like you.
// 5. I don't want to be friends with you.

// SuggestedReplies for User2:
// 1. I'm sorry if I upset you.
// 2. I didn't mean to offend you.
// 3. I was just trying to be friendly.
// 4. I didn't realize you felt that way.
// 5. I'll leave you alone now.`);

exports.extractSuggestedReplies = (text, user) => {
  // Initial validation
  if (!text || typeof text !== "string") {
    return [];
  }
  if (!user || typeof user !== "string") {
    return [];
  }

  try {
    // Extract user number
    const userNumber = user.match(/\d+$/);
    if (!userNumber) {
      console.error("No user number found in:", user);
      return [];
    }

    // Define the user part pattern
    const userPattern = `(?:user|User|USER)\\s*${userNumber[0]}`;

    // Define the section label pattern with suggested, recommend, and recommended
    const labelPattern = `(?:SUGGESTED|suggested|Suggested|RECOMMEND|recommend|Recommend|RECOMMENDED|recommended|Recommended)\\s*(?:REPLIES|replies|Replies|_REPLIES|_replies)`;

    // Regex for "user first" format (e.g., user1 suggestedReplies)
    const userFirstRegex = new RegExp(
      `${userPattern}` +
        `(?:\\s*(?:for|:|-)?\\s*)` +
        `${labelPattern}` +
        `(?:\\s*:\\s*)?` +
        `(.*?)(?=(?:\\r?\\n)+\\s*(?:user|User|USER)\\s*\\d+\\s*(?:for|:|-)?\\s*(?:SUGGESTED|suggested|Suggested|RECOMMEND|recommend|Recommend|RECOMMENDED|recommended|Recommended)\\s*(?:REPLIES|replies|Replies|_REPLIES|_replies)|$)`,
      "is"
    );

    // Regex for "label first" format (e.g., suggested replies for user1)
    const labelFirstRegex = new RegExp(
      `${labelPattern}` +
        `(?:\\s*(?:for|:|-)?\\s*)` +
        `${userPattern}` +
        `(?:\\s*:\\s*)?` +
        `(.*?)(?=(?:\\r?\\n)+\\s*(?:SUGGESTED|suggested|Suggested|RECOMMEND|recommend|Recommend|RECOMMENDED|recommended|Recommended)\\s*(?:REPLIES|replies|Replies|_REPLIES|_replies)\\s*(?:for|:|-)?\\s*(?:user|User|USER)\\s*\\d+|$)`,
      "is"
    );

    // Debug the input and regexes
    // console.log("Input text:", text);
    // console.log("User-first Regex:", userFirstRegex.source);
    // console.log("Label-first Regex:", labelFirstRegex.source);

    // Try both regexes
    let match = text.match(userFirstRegex);
    if (!match) {
      match = text.match(labelFirstRegex);
    }

    if (!match) {
      console.error("No match found with either regex.");
      return [];
    }

    // Extract and clean replies
    const sectionContent = match[1];
    return sectionContent
      .split(/\r?\n/)
      .map((reply) => {
        let cleanedReply = reply.trim();
        cleanedReply = cleanedReply
          .replace(/(\*{1,2}|_{1,2}|["']|\[|\]|\(|\)|\{|\})/g, "")
          .trim();
        return cleanedReply;
      })
      .filter(
        (reply) =>
          reply.length > 0 &&
          !reply.match(
            new RegExp(
              `^(?:(?:user|User|USER)\\s*\\d+\\s*(?:for|:|-)?\\s*${labelPattern}|${labelPattern}\\s*(?:for|:|-)?\\s*(?:user|User|USER)\\s*\\d+)`,
              "i"
            )
          )
      );
  } catch (error) {
    console.error("Error in extractSuggestedReplies:", error.message);
    return [];
  }
};

//   `
// Mood: angry

// Summary: User1 has become agitated and unfriendly in response to User2's request for friendship.

// SuggestedReplies for User1:
// I don't think we can be friends.
// I don't want to talk to you anymore.
// I don't need any more friends.
// I don't like you.
// I don't want to be friends with you.

// SuggestedReplies for User2:
// I'm sorry if I upset you.
// I didn't mean to offend you.
// I was just trying to be friendly.
// I didn't realize you felt that way.
// I'll leave you alone now.`,
//   "User 2"
// );
