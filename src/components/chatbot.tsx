import React, { useState, useRef, useEffect } from "react";
import "./compStyles.css";
import botIcon from "../assets/react.svg";
import arrowBackIcon from "../assets/arrow_back.svg"; // Use the back button icon

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
    <div className="chat-container">
      <div className="chat-window">
        <div className="chat-messages" ref={messagesEndRef}>
          {messages.map((message, index) => (
            <div key={index} className={`message ${message.sender.toLowerCase()}`}>
              {message.sender !== "User" && (
                <span className="bot-icon">
                  <img src={botIcon} alt="Bot Icon" />
                </span>
              )}
              {message.content}
            </div>
          ))}
        </div>
        <div
          className="chat-input"
          style={{
            backgroundColor: "#f8f8f8", // New background color
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
              color: "#49454f", // New text color
            }}
          />
          <button
            onClick={handleSendMessage}
            style={{
              backgroundColor: "transparent",
              border: "none",
              cursor: "pointer",
              borderRadius: "50%", // Add rounded corners for a circular button
              padding: "5px", // Add some padding for better spacing
              transition: "background-color 0.3s", // Smooth transition for hover effect
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "aliceblue"; // Hover effect background
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent"; // Reset background on hover out
            }}
          >
            <span className="send-icon">
              <img
                src={arrowBackIcon}
                alt="Send Icon"
                style={{
                  width: "30px", // Increased width for better visibility
                  height: "30px", // Increased height for better visibility
                  transform: "rotate(90deg)", // Rotate upwards
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