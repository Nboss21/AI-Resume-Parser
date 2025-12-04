import React from "react";
import {
  FaPaperPlane,
  FaRobot,
  FaUser,
  FaExternalLinkAlt,
} from "react-icons/fa";

const ChatInterface = ({
  messages,
  input,
  setInput,
  loading,
  sendMessage,
  quickSuggestions,
}) => {
  const messagesEndRef = React.useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="chat-interface">
      <div className="chat-messages">
        {messages.map((message) => (
          <div key={message.id} className={`message ${message.sender}`}>
            <div className="message-header">
              <div className="sender-icon">
                {message.sender === "ai" ? <FaRobot /> : <FaUser />}
              </div>
              <div className="sender-info">
                <span className="sender-name">
                  {message.sender === "ai" ? "AI Job Hunter" : "You"}
                </span>
                <span className="message-time">
                  {formatTime(message.timestamp)}
                </span>
              </div>
            </div>

            <div className="message-content">
              <p>{message.text}</p>

              {message.toolUsed && message.searchResults && (
                <div className="search-results">
                  <div className="results-header">
                    <FaExternalLinkAlt /> Found Job Listings
                  </div>
                  <div className="results-list">
                    {message.searchResults.slice(0, 3).map((result, index) => (
                      <a
                        key={index}
                        href={result.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="job-result"
                      >
                        <h5>{result.title}</h5>
                        <p className="company">{result.source}</p>
                        <p className="snippet">
                          {result.content.substring(0, 150)}...
                        </p>
                        <span className="visit-link">Visit Job Page →</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="message ai">
            <div className="message-header">
              <div className="sender-icon">
                <FaRobot />
              </div>
              <div className="sender-info">
                <span className="sender-name">AI Job Hunter</span>
              </div>
            </div>
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={sendMessage} className="chat-input-form">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about job opportunities, search for specific roles..."
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          <FaPaperPlane />
          {loading ? "Searching..." : "Send"}
        </button>
      </form>
    </div>
  );
};

export default ChatInterface;
