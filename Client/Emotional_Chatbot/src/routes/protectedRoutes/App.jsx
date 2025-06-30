import Header from "../../components/Header";
import ChatWindow from "../../components/ChatWindow";
import useAppInit from "../../hooks/useAppInit";
import SuggestionBox from "../../components/SuggestionBox";
import { useSelector } from "react-redux";
import StickerRenderer from "../../components/StickerRenderer";
import { useRef } from "react";
function App() {
  const selectedChatboxId = useSelector((store) => store.onlineUsers.chatboxId);
  const chatboxes = useSelector((store) => store.chatbox);
  const chatbox = chatboxes.find((box) => box.chatboxId === selectedChatboxId);

  const theme = chatbox ? `theme_${chatbox.current_theme}` : "theme_neutral";
  // console.log(theme);
  useAppInit();
  const inputRef = useRef();
  return (
    <div className={`theme ${theme}`}>
      <div className="root_bg ">
        <Header></Header>
        <StickerRenderer theme={theme} count={20}></StickerRenderer>
        <div className="appgrid">
          <ChatWindow inputRef={inputRef}></ChatWindow>
          <SuggestionBox inputRef={inputRef}></SuggestionBox>
        </div>
      </div>
    </div>
  );
}

export default App;
