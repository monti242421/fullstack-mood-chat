import { createSlice } from "@reduxjs/toolkit";
const chatboxSlice = createSlice({
  name: "chatbox",
  initialState: [],
  reducers: {
    addNewChatbox: (state, action) => {
      const exists = state.find(
        (chatbox) => chatbox.chatboxId === action.payload.chatboxId
      );
      if (!exists) {
        state.push({
          chatboxId: action.payload,
          messages: [],
          cycle: {
            turn: 0,
            type: null,
          },
          previous_mood_summary: {
            mood: "calm",
            summary: "Conversation was stable with no strong emotion",
          },
          current_theme: "neutral",
        });
      }
      // console.log(...state);
    },
    addMessage: (state, action) => {
      const { chatboxId, message, type } = action.payload;

      const chatbox = state.find((chatbox) => chatbox.chatboxId === chatboxId);
      if (chatbox) {
        chatbox.messages.push({ message, type });
      }
      // console.log(...state);
    },

    changeCycleTurn: (state, action) => {
      const { chatboxId, type } = action.payload;
      // console.log(chatboxId, type);
      const chatbox = state.find((chatbox) => chatbox.chatboxId === chatboxId);
      if (chatbox) {
        const { cycle } = chatbox;
        if (type === cycle.type) {
          chatbox.cycle.turn = chatbox.cycle.turn;
          chatbox.cycle.type = chatbox.cycle.type;
        } else {
          chatbox.cycle.turn = chatbox.cycle.turn + 1;
          chatbox.cycle.type = type;
        }
        // console.log(chatbox.cycle.turn);
      }
    },
    resetCycle: (state, action) => {
      const chatboxId = action.payload;
      const chatbox = state.find((chatbox) => chatbox.chatboxId === chatboxId);
      chatbox.cycle.turn = 0;
      chatbox.cycle.type = null;
    },
    setprevious_mood_summary: (state, action) => {
      // console.log(action.payload);
      const chatbox = state.find(
        (chatbox) => chatbox.chatboxId === action.payload.chatboxId
      );
      chatbox.previous_mood_summary.mood = action.payload.mood;
      chatbox.previous_mood_summary.summary = action.payload.summary;
    },
    setcurrent_theme: (state, action) => {
      console.log(action.payload);
      const chatbox = state.find(
        (chatbox) => chatbox.chatboxId === action.payload.chatboxId
      );
      chatbox.current_theme = action.payload.mood;
    },
  },
});

export default chatboxSlice;
export const chatboxSliceSliceAction = chatboxSlice.actions;
