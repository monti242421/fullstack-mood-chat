import { createSlice, current } from "@reduxjs/toolkit";
const onlineUsersSlice = createSlice({
  name: "onlineUsers",
  initialState: {
    onlineUsers: [],
    selectedUserName: "",
    selectedUserId: "",
    chatboxId: "",
    current_user_suggested_replies: [],
  },
  reducers: {
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
      return state;
    },
    setselectedUserName: (state, action) => {
      state.selectedUserName = action.payload;
      return state;
    },

    setselectedId: (state, action) => {
      state.selectedUserId = action.payload;
      return state;
    },
    setChatboxId: (state, action) => {
      state.chatboxId = action.payload;
      return state;
    },
    setcurrent_user_suggested_replies: (state, action) => {
      // console.log(action.payload);
      state.current_user_suggested_replies = action.payload;
      return state;
    },
  },
});

export default onlineUsersSlice;
export const onlineUsersSliceAction = onlineUsersSlice.actions;
