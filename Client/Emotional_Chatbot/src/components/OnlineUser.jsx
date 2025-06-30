import { FaUserCircle } from "react-icons/fa";
import { FaUserGroup } from "react-icons/fa6";
import { FaCircle } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { onlineUsersSliceAction } from "../store/onlineUsersSlice";
import { chatboxSliceSliceAction } from "../store/chatboxSlice";
import socket from "../socket/socket";
import { useState } from "react";

function OnlineUser({ data }) {
  const [fetched, setFetched] = useState(false);
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
  const chatboxes = useSelector((store) => store.chatbox);
  const dispatch = useDispatch();

  const uniqueChatId = [currentuserid, data.userId].sort().join("_");
  const HandleSelectUser = () => {
    if (!fetched) {
      setFetched(true);
      socket.emit("get_all_messages_of_this_user", uniqueChatId);
      socket.once("get_all_messages_of_this_user", (data) => {
        for (let i = 0; i < data.msgs.length; i++) {
          const chatboxId = data.chatbox_id;
          const messages = data.msgs[i].messages;
          const type =
            data.msgs[i].sender_id == currentuserid ? "sent" : "recieved";

          dispatch(
            chatboxSliceSliceAction.addMessage({
              chatboxId: chatboxId,
              message: messages,
              type: type,
            })
          );
        }
      });
    }

    dispatch(onlineUsersSliceAction.setselectedUserName(data.username));
    dispatch(onlineUsersSliceAction.setselectedId(data.userId));
    dispatch(onlineUsersSliceAction.setChatboxId(uniqueChatId));
  };
  const chatbox = chatboxes.find((box) => {
    if (box.chatboxId === uniqueChatId) {
      return box;
    }
  });

  if (currentuserid == data.userId) {
    return;
  }
  return (
    <div className="onlineuser" onClick={HandleSelectUser}>
      <div className="onlineusericon">
        <FaUserCircle size={40} />
      </div>
      <div className="onlineuserdetails">
        <div className="onlineusername">{data.username}</div>
        <div className="onlineuserpreviouschat">
          {!chatbox
            ? "There is no chat with this user"
            : chatbox.messages[chatbox.messages.length - 1]
            ? chatbox.messages[chatbox.messages.length - 1].message
            : "There is no chat with this user"}
        </div>
      </div>
      <div className="onlineuserlivestatus">
        <FaCircle size={10} style={{ color: "#03fc45" }} />
      </div>
    </div>
  );
}
export default OnlineUser;
