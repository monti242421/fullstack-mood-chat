import { configureStore } from "@reduxjs/toolkit";
import onlineUsersSlice from "./onlineUsersSlice";
import chatboxSlice from "./chatboxSlice";

const appStore = configureStore({
  reducer: {
    onlineUsers: onlineUsersSlice.reducer,
    chatbox: chatboxSlice.reducer,
  },
});

export default appStore;
