import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { FaUpload, FaSpinner, FaCheck } from "react-icons/fa";
import ResumeForm from "./components/ResumeForm";

const ResumeParser = ({ onResumeParsed }) => {
  const [loading, setLoading] = useState(false);
  const [parsedData, setParsedData] = useState(null);
  const [error, setError] = useState("");

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
    },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        await parseResume(acceptedFiles[0]);
      }
    },
  });

  const parseResume = async (file) => {
    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("resume", file);

    try {
      const response = await axios.post("/api/resume/parse", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        setParsedData(response.data.data);
        onResumeParsed(response.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.error || "Failed to parse resume");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (formData) => {
    try {
      await axios.post("/api/resume/save", { resumeData: formData });
      alert("Resume data saved successfully!");
    } catch (err) {
      alert("Failed to save resume data");
    }
  };

  return (
    <div className="resume-parser">
      <div className="upload-section">
        <h2>Upload Your Resume</h2>
        <p>Supported formats: PDF, DOCX</p>

        <div
          {...getRootProps()}
          className={`dropzone ${isDragActive ? "active" : ""}`}
        >
          <input {...getInputProps()} />
          <FaUpload size={48} className="upload-icon" />
          {isDragActive ? (
            <p>Drop the file here...</p>
          ) : (
            <p>Drag & drop your resume here, or click to select</p>
          )}
        </div>

        {loading && (
          <div className="loading">
            <FaSpinner className="spinner" />
            <p>Parsing your resume with AI...</p>
          </div>
        )}

        {error && (
          <div className="error">
            <p>{error}</p>
          </div>
        )}

        {parsedData && (
          <div className="success">
            <FaCheck className="check-icon" />
            <p>Resume parsed successfully!</p>
          </div>
        )}
      </div>

      {parsedData && (
        <div className="parsed-data">
          <ResumeForm initialData={parsedData} onSave={handleSave} />
        </div>
      )}
    </div>
  );
};

export default ResumeParser;
