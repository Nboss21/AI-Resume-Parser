import React, { useState, useEffect } from "react";
import { FaSave, FaEdit, FaCheck } from "react-icons/fa";

const ResumeForm = ({ initialData, onSave }) => {
  const [formData, setFormData] = useState(initialData);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const handleChange = (section, index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: prev[section].map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const handleSkillChange = (index, value) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.map((skill, i) => (i === index ? value : skill)),
    }));
  };

  const handleAddSkill = () => {
    setFormData((prev) => ({
      ...prev,
      skills: [...prev.skills, "New Skill"],
    }));
  };

  const handleRemoveSkill = (index) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="resume-form">
      <div className="form-header">
        <h2>Review & Edit Your Resume Data</h2>
        <div className="form-actions">
          <button className="edit-btn" onClick={() => setEditing(!editing)}>
            {editing ? <FaCheck /> : <FaEdit />}
            {editing ? "Stop Editing" : "Edit Details"}
          </button>
          <button className="save-btn" onClick={() => onSave(formData)}>
            <FaSave /> Save to Profile
          </button>
        </div>
      </div>

      <div className="form-grid">
        <div className="form-section">
          <h3>Personal Information</h3>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              value={formData.name || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              disabled={!editing}
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={formData.email || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
              disabled={!editing}
            />
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input
              type="tel"
              value={formData.phone || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, phone: e.target.value }))
              }
              disabled={!editing}
            />
          </div>
        </div>

        <div className="form-section">
          <h3>Skills</h3>
          <div className="skills-container">
            {formData.skills.map((skill, index) => (
              <div key={index} className="skill-item">
                <input
                  type="text"
                  value={skill}
                  onChange={(e) => handleSkillChange(index, e.target.value)}
                  disabled={!editing}
                />
                {editing && (
                  <button
                    className="remove-btn"
                    onClick={() => handleRemoveSkill(index)}
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
            {editing && (
              <button className="add-btn" onClick={handleAddSkill}>
                + Add Skill
              </button>
            )}
          </div>
        </div>

        <div className="form-section full-width">
          <h3>Work Experience</h3>
          {formData.experience.map((exp, index) => (
            <div key={index} className="experience-item">
              <div className="form-row">
                <div className="form-group">
                  <label>Company</label>
                  <input
                    type="text"
                    value={exp.company || ""}
                    onChange={(e) =>
                      handleChange(
                        "experience",
                        index,
                        "company",
                        e.target.value
                      )
                    }
                    disabled={!editing}
                  />
                </div>
                <div className="form-group">
                  <label>Position</label>
                  <input
                    type="text"
                    value={exp.position || ""}
                    onChange={(e) =>
                      handleChange(
                        "experience",
                        index,
                        "position",
                        e.target.value
                      )
                    }
                    disabled={!editing}
                  />
                </div>
                <div className="form-group">
                  <label>Duration</label>
                  <input
                    type="text"
                    value={exp.duration || ""}
                    onChange={(e) =>
                      handleChange(
                        "experience",
                        index,
                        "duration",
                        e.target.value
                      )
                    }
                    disabled={!editing}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Responsibilities</label>
                <textarea
                  value={exp.responsibilities?.join("\n") || ""}
                  onChange={(e) =>
                    handleChange(
                      "experience",
                      index,
                      "responsibilities",
                      e.target.value.split("\n")
                    )
                  }
                  disabled={!editing}
                  rows={3}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="form-section">
          <h3>Education</h3>
          {formData.education.map((edu, index) => (
            <div key={index} className="education-item">
              <div className="form-group">
                <label>Institution</label>
                <input
                  type="text"
                  value={edu.institution || ""}
                  onChange={(e) =>
                    handleChange(
                      "education",
                      index,
                      "institution",
                      e.target.value
                    )
                  }
                  disabled={!editing}
                />
              </div>
              <div className="form-group">
                <label>Degree</label>
                <input
                  type="text"
                  value={edu.degree || ""}
                  onChange={(e) =>
                    handleChange("education", index, "degree", e.target.value)
                  }
                  disabled={!editing}
                />
              </div>
              <div className="form-group">
                <label>Year</label>
                <input
                  type="text"
                  value={edu.year || ""}
                  onChange={(e) =>
                    handleChange("education", index, "year", e.target.value)
                  }
                  disabled={!editing}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResumeForm;
