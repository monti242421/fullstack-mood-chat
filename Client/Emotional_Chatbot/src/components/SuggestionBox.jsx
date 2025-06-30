import { useSelector } from "react-redux";
import Replies from "./Replies";
import StickerRenderer from "./StickerRenderer";
import { LuMessageCircleReply } from "react-icons/lu";
import { useEffect, useState } from "react";

function SuggestionBox({ inputRef }) {
  const { current_user_suggested_replies } = useSelector(
    (store) => store.onlineUsers
  );
  const selectedChatboxId = useSelector((store) => store.onlineUsers.chatboxId);
  const chatboxes = useSelector((store) => store.chatbox);
  const chatbox = chatboxes.find((box) => box.chatboxId === selectedChatboxId);
  const theme = chatbox ? `theme_${chatbox.current_theme}` : "theme_neutral";

  const [fadeState, setFadeState] = useState("fade-in");
  const [renderedReplies, setRenderedReplies] = useState([]);

  useEffect(() => {
    if (
      JSON.stringify(current_user_suggested_replies) ===
      JSON.stringify(renderedReplies)
    ) {
      return;
    }

    setFadeState("fade-out");

    const timeout = setTimeout(() => {
      setRenderedReplies(current_user_suggested_replies);
      setFadeState("fade-in");
    }, 300); // Match CSS fade time

    return () => clearTimeout(timeout);
  }, [current_user_suggested_replies]);

  return (
    <div className={`suggestionboxcontainer ${theme}`}>
      <StickerRenderer theme={theme} count={4} />

      <div className="suggestionboxheader">
        <span>
          <LuMessageCircleReply size={30} />
        </span>
        &nbsp;&nbsp;Need a Hint? - Use Smart Replies
      </div>

      <div className={`replies-container ${fadeState}`}>
        {renderedReplies.map((reply) => (
          <Replies key={reply} Data={reply} inputRef={inputRef} />
        ))}
      </div>
    </div>
  );
}

export default SuggestionBox;
