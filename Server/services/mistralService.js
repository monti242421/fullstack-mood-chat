const axios = require("axios");

// Replace with your actual Mistral API key
const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY;
const MODEL = "mistral-small"; // or 'mistral-medium' if you have access
const API_URL = "https://api.mistral.ai/v1/chat/completions";

// Function to call Mistral API
async function callMistral(prompt) {
  try {
    const res = await axios.post(
      API_URL,
      {
        model: MODEL,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${MISTRAL_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return res.data.choices[0].message.content.trim();
  } catch (err) {
    console.error(
      "Error calling Mistral API:",
      err.response?.data || err.message
    );
    return null;
  }
}

async function fetchMoodFromConversation(
  conversationBlock,
  previous_mood_summary
) {
  try {
    const prompt = `
Analyze the emotional tone of the following conversation between two users in context with 
prevoius mood and previous conversation summary

Previous mood: ${previous_mood_summary.mood} 
Previous summary: ${previous_mood_summary.summary}

Recent conversation: ${conversationBlock}

Follow this format exactly and respond only in this format. No explanations. No extra output.

Mood: [Choose one only: sad, happy, angry, love, calm]  
Summary: [1–2 sentence emotional summary]  
SuggestedReplies for User1:  
Reply 1  
Reply 2  
Reply 3  
Reply 4  
Reply 5

SuggestedReplies for User2:  
Reply 1  
Reply 2  
Reply 3  
Reply 4  
Reply 5

Dont put User1 or User2 in replies, and dont put what user1 or user2 is thinking, only give 
what user1 or user2 is going to say.
Dont put word reply. Avoid quotes,asterisks or any other formatting, only give text in  plain.
`;

    const result = await callMistral(prompt);
    return result;
  } catch (err) {
    console.log(err);
  }
}

module.exports = fetchMoodFromConversation;
