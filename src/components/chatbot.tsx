import React, { useState, useRef, useEffect } from "react";
import botIcon from "../assets/react.svg";
import arrowBackIcon from "../assets/arrow_back.svg";
import { ChatMessage } from "./types";

interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, onSendMessage }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [newMessage, setNewMessage] = useState<string>("");
  const [isInputWrapperFocused, setIsInputWrapperFocused] = useState(false);

  const handleSendMessageClick = () => {
    if (newMessage.trim() !== "") {
      onSendMessage(newMessage);
      setNewMessage("");
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessageClick();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "0px",
        backgroundColor: "var(--background-color, #ffffff)",
        color: "var(--text-color, #000000)",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "var(--background-color, #ffffff)",
          padding: "0px",
        }}
      >
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: "15px",
            padding: "0px",
            scrollbarWidth: "thin",
            scrollbarColor: "var(--border-color, #c4c4c4) transparent",
          }}
          ref={messagesEndRef}
        >
          {messages.map((message) => (
            <div
              key={message.id}
              style={{
                maxWidth: "80%",
                padding: "10px 15px",
                fontSize: "16px",
                lineHeight: "1.4",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                backgroundColor:
                  message.sender === "user"
                    ? "var(--accent-color, #007bff)"
                    : "transparent",
                color:
                  message.sender === "user"
                    ? "var(--button-text, #ffffff)"
                    : "var(--text-color, #000000)",
                borderRadius:
                  message.sender === "user"
                    ? "10px 10px 0px 10px"
                    : "10px 10px 10px 0px",
                alignSelf: message.sender === "user" ? "flex-end" : "flex-start",
              }}
            >
              {message.sender === "bot" && (
                <span
                  style={{
                    display: "inline-block",
                    padding: "4px",
                    marginRight: "8px",
                  }}
                >
                  <img src={botIcon} alt="Bot Icon" />
                </span>
              )}
              {message.text}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div
          style={{
            backgroundColor: "var(--input-bg, #f8f8f8)",
            borderRadius: "20px",
            padding: "10px 20px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            boxShadow: isInputWrapperFocused ? `0 0 6px 1px var(--focus-ring-color-light, rgba(0, 123, 255, 0.3))` : 'none',
            transition: 'box-shadow 0.2s ease-in-out',
          }}
        >
          <input
            type="text"
            className="chat-input-field"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            onKeyPress={handleKeyPress}
            onFocus={() => setIsInputWrapperFocused(true)}
            onBlur={() => setIsInputWrapperFocused(false)}
            style={{
              flexGrow: 1,
              padding: "10px 15px",
              border: "none",
              backgroundColor: "transparent",
              fontSize: "16px",
              outline: "none",
              color: "var(--input-text, #49454f)",
              boxShadow: 'none !important',
            }}
          />
          <button
            onClick={handleSendMessageClick}
            style={{
              backgroundColor: "transparent",
              border: "none",
              cursor: "pointer",
              borderRadius: "50%",
              padding: "5px",
              transition: "background-color 0.3s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "var(--button-hover-bg, aliceblue)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "transparent")
            }
          >
            <span>
              <img
                src={arrowBackIcon}
                alt="Send Icon"
                style={{
                  maxWidth: "20px",
                  transform: "rotate(90deg)",
                }}
              />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;