import React, { useState, useRef, useEffect } from "react";
import botIcon from "../assets/react.svg";
import arrowBackIcon from "../assets/arrow_back.svg";

interface Message {
  sender: string;
  content: string;
}

const ChatInterface: React.FC = () => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "Bot",
      content: `Welcome to the AI Assistant! I can help you with:
🌐 Web Development - HTML, CSS, JavaScript, React, Node.js
📊 Data Analysis - Python, Pandas, Data Visualization
🤖 AI & ML - Machine Learning concepts, TensorFlow, PyTorch
💼 Professional Services - Resume review, interview prep
📚 Learning Resources - Tutorial recommendations, documentation help

Ask me anything, and I'll do my best to provide clear explanations and code examples!`,
    },
  ]);
  const [newMessage, setNewMessage] = useState<string>("");

  const handleSendMessage = () => {
    if (newMessage.trim() !== "") {
      setMessages([
        ...messages,
        { sender: "User", content: newMessage },
        { sender: "Bot", content: "Hello! How can I help you today?" },
      ]);
      setNewMessage("");
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
        height: "100%", // Full viewport height minus navbar height
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "0px",
        backgroundColor: "var(--background-color, #ffffff)", // Theme background
        color: "var(--text-color, #000000)", // Theme text color
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "var(--background-color, #ffffff)", // Theme background
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
            scrollbarWidth: "thin", // For Firefox
            scrollbarColor: "var(--border-color, #c4c4c4) transparent", // Custom scrollbar
          }}
          ref={messagesEndRef}
        >
          {messages.map((message, index) => (
            <div
              key={index}
              style={{
                maxWidth: "80%",
                padding: "10px 15px",
                fontSize: "16px",
                lineHeight: "1.4",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                backgroundColor:
                  message.sender === "User"
                    ? "var(--accent-color, #007bff)" // User message background
                    : "transparent",
                color:
                  message.sender === "User"
                    ? "var(--button-text, #ffffff)" // User message text
                    : "var(--text-color, #000000)", // Bot message text
                borderRadius:
                  message.sender === "User"
                    ? "10px 10px 0px 10px"
                    : "10px 10px 10px 0px",
                alignSelf: message.sender === "User" ? "flex-end" : "flex-start",
              }}
            >
              {message.sender !== "User" && (
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
              {message.content}
            </div>
          ))}
        </div>
        <div
          style={{
            backgroundColor: "var(--input-bg, #f8f8f8)", // Theme input background
            borderRadius: "20px",
            padding: "10px 20px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            style={{
              flexGrow: 1,
              padding: "10px 15px",
              border: "none",
              backgroundColor: "transparent",
              fontSize: "16px",
              outline: "none",
              color: "var(--input-text, #49454f)", // Theme input text color
            }}
          />
          <button
            onClick={handleSendMessage}
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