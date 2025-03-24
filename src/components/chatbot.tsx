import React, { useState, useRef, useEffect  } from "react";
import "./compStyles.css";
import botIcon from "../assets/react.svg";
import SendIcon from "../assets/send.svg";

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

Ask me anything, and I'll do my best to provide clear explanations and code examples!` 
    }
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
        <div className="chat-input">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
          />
          <button onClick={handleSendMessage}>
            <span className="send-icon">
              <img src={SendIcon} width="20px" height="20px" alt="Send Icon" />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;