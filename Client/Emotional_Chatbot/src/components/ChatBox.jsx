import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { VariableSizeList as List } from "react-window";
import { chatboxSliceSliceAction } from "../store/chatboxSlice";
import socket from "../socket/socket";

// Utility to create 4-cycle batch from message array in Redux store
function buildFourCycleBatch(messages) {
  if (!messages || messages.length === 0) return [];

  const groupedTurns = [];
  let currentTurn = null;

  // Go through messages in reverse (from newest to oldest)
  for (let i = messages.length - 1; i >= 0; i--) {
    const msg = messages[i];

    if (!currentTurn || msg.type !== currentTurn.type) {
      // Start a new turn
      if (currentTurn) {
        groupedTurns.unshift(currentTurn); // prepend to list
      }
      currentTurn = {
        type: msg.type,
        messages: [msg.message],
      };
    } else {
      // Add to existing turn
      currentTurn.messages.unshift(msg.message);
    }

    // Stop when we have 8 turns (4 cycles)
    if (groupedTurns.length === 8) break;
  }

  if (currentTurn && groupedTurns.length < 8) {
    groupedTurns.unshift(currentTurn);
  }

  // Group into 4 cycles (each cycle = [User1Turn, User2Turn])
  const cycles = [];
  for (let i = 0; i < groupedTurns.length - 1; i += 2) {
    const user1Turn = groupedTurns[i];
    const user2Turn = groupedTurns[i + 1];
    if (user1Turn && user2Turn) {
      cycles.push([
        {
          sender: user1Turn.type === "sent" ? "User1" : "User2",
          text: user1Turn.messages.join(" "),
        },
        {
          sender: user2Turn.type === "sent" ? "User1" : "User2",
          text: user2Turn.messages.join(" "),
        },
      ]);
    }
  }

  return cycles.slice(-4); // only last 4 cycles
}

const ChatBox = () => {
  const dispatch = useDispatch();
  const selectedUserId = useSelector(
    (store) => store.onlineUsers.selectedUserId
  );
  const selectedChatboxId = useSelector((store) => store.onlineUsers.chatboxId);
  const chatboxes = useSelector((store) => store.chatbox);
  const chatbox = chatboxes.find((box) => box.chatboxId === selectedChatboxId);

  const noofcycles = 6; // to include total 8 converstation chats of both sides
  if (chatbox) {
    if (chatbox.cycle.turn == noofcycles && chatbox.cycle.type == "sent") {
      const cyclebatchobject = buildFourCycleBatch(chatbox.messages);
      const previous_mood_summary = chatbox.previous_mood_summary;
      socket.emit("conversationsBatch", {
        cyclebatchobject,
        previous_mood_summary,
        selectedUserId,
        selectedChatboxId,
      });
    }
    console.log(chatbox.cycle.turn);

    if (chatbox.cycle.turn == noofcycles) {
      dispatch(chatboxSliceSliceAction.resetCycle(chatbox.chatboxId));
    }
  }

  const endRef = useRef();

  const messages = chatbox ? [...chatbox.messages].reverse() : [];

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  if (!selectedChatboxId) return;
  if (!chatbox) {
    return;
  }

  return (
    <div style={{ height: "290px" }} className="chatbox-list">
      <div ref={endRef}></div>
      {messages.map((msg) => (
        <div className={`chat-message ${msg.type}`}>{msg.message}</div>
      ))}
    </div>
  );
};

export default ChatBox;
