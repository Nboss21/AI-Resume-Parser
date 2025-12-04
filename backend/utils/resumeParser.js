import { GoogleGenerativeAI } from "@google/generative-ai";

import mammoth from "mammoth";
import fs from "fs";
import path from "path";
import * as pdfParseModule from "pdf-parse";
import "dotenv/config";

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Resume schema for structured output
const resumeSchema = {
  description: "Resume information extraction",
  type: "object",
  properties: {
    name: {
      type: "string",
      description: "Full name of the candidate",
    },
    email: {
      type: "string",
      description: "Email address",
    },
    phone: {
      type: "string",
      description: "Phone number",
    },
    skills: {
      type: "array",
      items: { type: "string" },
      description: "List of technical and professional skills",
    },
    experience: {
      type: "array",
      items: {
        type: "object",
        properties: {
          company: { type: "string" },
          position: { type: "string" },
          duration: { type: "string" },
          responsibilities: {
            type: "array",
            items: { type: "string" },
          },
        },
      },
    },
    education: {
      type: "array",
      items: {
        type: "object",
        properties: {
          institution: { type: "string" },
          degree: { type: "string" },
          year: { type: "string" },
        },
      },
    },
    summary: {
      type: "string",
      description: "Professional summary or objective",
    },
  },
  required: ["name", "skills", "experience", "education"],
};

export async function extractTextFromPDF(buffer) {
  try {
    const data = await pdfParse(buffer);
    return data.text;
  } catch (error) {
    throw new Error("Failed to parse PDF: " + error.message);
  }
}

export async function extractTextFromDOCX(buffer) {
  try {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  } catch (error) {
    throw new Error("Failed to parse DOCX: " + error.message);
  }
}

export async function parseResumeWithAI(resumeText) {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: resumeSchema,
      },
    });

    const prompt = `Extract structured information from this resume:\n\n${resumeText}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return JSON.parse(text);
  } catch (error) {
    console.error("AI Parsing Error:", error);
    throw new Error("Failed to parse resume with AI");
  }
}
