import { FaUserLarge } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import socket from "../socket/socket";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import { LiaRobotSolid } from "react-icons/lia";

const Header = () => {
  const navigate = useNavigate();
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
  const username = parseJwt(token).username;
  const HandleLogout = () => {
    localStorage.removeItem("token");
    socket.disconnect();
    navigate("/login");
  };
  const [showLogout, setshowLogout] = useState(false);
  return (
    <>
      <div
        style={{
          position: "relative",
          display: "inline-block",
          marginLeft: "100px",
          zIndex: 1,
          padding: "3px",
        }}
      >
        <h5>Features</h5>

        <span>
          <IoChatboxEllipsesOutline size={20} style={{ color: "blue" }} />
        </span>
        <span>&nbsp;Chatting...&nbsp;&nbsp;&nbsp;&nbsp;</span>

        <span>😍</span>
        <span>&nbsp;Detecting emotions...&nbsp;&nbsp;&nbsp;&nbsp;</span>
        <span>🎨</span>
        <span>&nbsp;Changing Themes...&nbsp;&nbsp;&nbsp;&nbsp;</span>
        <span>
          <LiaRobotSolid size={20} />
        </span>
        <span>&nbsp;Suggesting replies...</span>
      </div>
      <div className="logout_button_container">
        <button
          style={{ background: "none", border: "none" }}
          onClick={() => {
            if (showLogout) {
              setshowLogout(false);
            } else {
              setshowLogout(true);
            }
          }}
        >
          {" "}
          <div className=" badge rounded-pill bg-danger username">
            {username}
          </div>
          <FaUserLarge size={40} />
        </button>

        <button
          className="logout_button"
          hidden={showLogout ? "" : "hidden"}
          onClick={HandleLogout}
        >
          LogOut
        </button>
      </div>
    </>
  );
};

export default Header;
