import React, { useState } from "react";
import ResumeParser from "./ResumeParser";
import JobHunter from "./JobHunter";
import "./styles/App.css";

function App() {
  const [resumeData, setResumeData] = useState(null);
  const [activeTab, setActiveTab] = useState("parser");

  const handleResumeParsed = (data) => {
    setResumeData(data);
    setActiveTab("hunter");
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🤖 AI Resume Agent</h1>
        <p>Upload your resume and let AI help you find your dream job</p>
      </header>

      <div className="tabs">
        <button
          className={`tab ${activeTab === "parser" ? "active" : ""}`}
          onClick={() => setActiveTab("parser")}
        >
          📄 Resume Parser
        </button>
        <button
          className={`tab ${activeTab === "hunter" ? "active" : ""}`}
          onClick={() => setActiveTab("hunter")}
          disabled={!resumeData}
        >
          🔍 Job Hunter {!resumeData && "(Upload Resume First)"}
        </button>
      </div>

      <main className="main-content">
        {activeTab === "parser" ? (
          <ResumeParser onResumeParsed={handleResumeParsed} />
        ) : (
          <JobHunter resumeData={resumeData} />
        )}
      </main>

      <footer className="app-footer">
        <p>Powered by Gemini AI & Tavily Search</p>
      </footer>
    </div>
  );
}

export default App;
