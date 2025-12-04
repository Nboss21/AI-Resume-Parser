import express from "express";
import multer from "multer";
import {
  extractTextFromPDF,
  extractTextFromDOCX,
  parseResumeWithAI,
} from "../utils/resumeParser.js";

const router = express.Router();

// Configure multer for file upload
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only PDF and DOCX allowed."));
    }
  },
});

// ===============================
//          PARSE RESUME
// ===============================
router.post("/parse", upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    let resumeText = "";

    // Extract text based on uploaded file type
    if (req.file.mimetype === "application/pdf") {
      resumeText = await extractTextFromPDF(req.file.buffer);
    } else if (
      req.file.mimetype ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      resumeText = await extractTextFromDOCX(req.file.buffer);
    }

    // Parse with AI
    const parsedData = await parseResumeWithAI(resumeText);

    // FIX: ensure session exists safely
    if (!req.session) req.session = {};

    req.session.resumeData = parsedData;

    res.json({
      success: true,
      data: parsedData,
      rawText: resumeText.substring(0, 500) + "...",
    });
  } catch (error) {
    console.error("Error parsing resume:", error);
    res.status(500).json({
      error: "Failed to parse resume",
      details: error.message,
    });
  }
});

// ===============================
//         SAVE PARSED DATA
// ===============================
router.post("/save", async (req, res) => {
  try {
    const { resumeData } = req.body;

    if (!resumeData) {
      return res.status(400).json({ error: "No resume data provided" });
    }

    // In production → save to database
    res.json({
      success: true,
      message: "Resume data saved successfully",
      data: resumeData,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to save resume data" });
  }
});

export default router;
