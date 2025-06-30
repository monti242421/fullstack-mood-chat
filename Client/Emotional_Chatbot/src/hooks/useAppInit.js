import { useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { onlineUsersSliceAction } from "../store/onlineUsersSlice";
import socket from "../socket/socket";
import { chatboxSliceSliceAction } from "../store/chatboxSlice";

function useAppInit() {
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
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        socket.connect();
        socket.emit("register", token);
        socket.emit("get_latest_messages", token);
        socket.emit("getonlineusers");

        socket.once("onlineusers", (onlineusers) => {
          dispatch(onlineUsersSliceAction.setOnlineUsers(onlineusers));
        });
        socket.once("get_latest_messages", (data) => {
          for (let i = 0; i < data.length; i++) {
            dispatch(chatboxSliceSliceAction.addNewChatbox(data[i].chatboxId));
          }
          for (let i = 0; i < data.length; i++) {
            const chatboxId = data[i].chatboxId;
            const messages = data[i].messages;
            const type =
              data[i].sender_id == currentuserid ? "sent" : "recieved";

            dispatch(
              chatboxSliceSliceAction.addMessage({
                chatboxId: chatboxId,
                message: messages,
                type: type,
              })
            );
          }
        });
      } catch (err) {
        console.log(err);
      }
    };
    fetchInitialData();
  }, []);
}

export default useAppInit;
