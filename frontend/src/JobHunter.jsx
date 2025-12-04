import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { FaPaperPlane, FaRobot, FaUser, FaSearch } from "react-icons/fa";
import ChatInterface from "./components/ChatInterface";

const JobHunter = ({ resumeData }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(uuidv4());
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Initialize chat with welcome message
    setMessages([
      {
        id: 1,
        text: `Hi ${resumeData.name}! I'm your AI Job Hunter. I've analyzed your resume with ${resumeData.skills.length} skills and ${resumeData.experience.length} positions. I can search for job openings that match your profile. What kind of roles are you looking for?`,
        sender: "ai",
        timestamp: new Date().toISOString(),
      },
    ]);
  }, [resumeData]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = {
      id: messages.length + 1,
      text: input,
      sender: "user",
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    const currentInput = input;
    setInput("");

    try {
      const response = await axios.post("/api/chat/job-hunter", {
        message: currentInput,
        resumeData,
        sessionId,
      });

      const aiMessage = {
        id: messages.length + 2,
        text: response.data.response,
        sender: "ai",
        timestamp: new Date().toISOString(),
        toolUsed: response.data.toolUsed,
        searchResults: response.data.searchResults,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: messages.length + 2,
          text: "Sorry, I encountered an error. Please try again.",
          sender: "ai",
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const quickSuggestions = [
    "Find me jobs matching my skills",
    "Search for remote developer positions",
    "Look for senior roles in my field",
    "Find companies hiring for my experience level",
  ];

  return (
    <div className="job-hunter">
      <div className="job-hunter-header">
        <h2>🔍 AI Job Hunter</h2>
        <div className="resume-summary">
          <h3>Your Profile Summary</h3>
          <p>
            <strong>Name:</strong> {resumeData.name}
          </p>
          <p>
            <strong>Top Skills:</strong>{" "}
            {resumeData.skills.slice(0, 5).join(", ")}
          </p>
          <p>
            <strong>Experience:</strong> {resumeData.experience.length}{" "}
            positions
          </p>
        </div>
      </div>

      <ChatInterface
        messages={messages}
        input={input}
        setInput={setInput}
        loading={loading}
        sendMessage={sendMessage}
        quickSuggestions={quickSuggestions}
      />

      <div className="quick-suggestions">
        <h4>Quick Search Suggestions:</h4>
        <div className="suggestion-buttons">
          {quickSuggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => {
                setInput(suggestion);
                setTimeout(() => {
                  document
                    .querySelector("form")
                    .dispatchEvent(new Event("submit", { bubbles: true }));
                }, 100);
              }}
              className="suggestion-btn"
            >
              <FaSearch /> {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default JobHunter;
