import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import * as Tavily from "@tavily/core";
import 'dotenv/config'; // or import dotenv from 'dotenv'; dotenv.config();


const router = express.Router();

// Initialize APIs
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const tavilyClient = Tavily.tavily({ apiKey: process.env.TAVILY_API_KEY });

// Define job search tool
const jobSearchTool = {
  name: "search_job_listings",
  description:
    "Search for job openings on various job boards and company websites",
  parameters: {
    type: "object",
    properties: {
      query: {
        type: "string",
        description:
          "Search query for job listings. Should include job title, skills, and location if specified.",
      },
      sites: {
        type: "array",
        items: { type: "string" },
        description:
          "Specific job sites to search (e.g., linkedin.com, indeed.com, glassdoor.com)",
      },
    },
    required: ["query"],
  },
};

// Store conversation history per session
const chatSessions = new Map();

router.post("/job-hunter", async (req, res) => {
  try {
    const { message, resumeData, sessionId } = req.body;

    if (!resumeData) {
      return res.status(400).json({ error: "Resume data is required" });
    }

    // Get or create chat session
    let chatHistory = chatSessions.get(sessionId) || [];

    // Create system prompt based on resume
    const systemPrompt = `You are a helpful Job Hunter AI assistant. 
    The user has the following resume information:
    
    Name: ${resumeData.name}
    Skills: ${resumeData.skills.join(", ")}
    Experience: ${JSON.stringify(resumeData.experience)}
    Education: ${JSON.stringify(resumeData.education)}
    
    Your task is to help the user find relevant job opportunities. 
    Use the search_job_listings tool to find actual job openings that match their skills and experience.
    Provide specific, actionable job recommendations.`;

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      systemInstruction: systemPrompt,
      tools: [{ functionDeclarations: [jobSearchTool] }],
    });

    // Start or continue chat
    const chat = model.startChat({
      history: chatHistory,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2000,
      },
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;

    // Check for function calls
    const functionCalls = response.functionCalls();

    if (functionCalls && functionCalls.length > 0) {
      const toolResults = [];

      for (const funcCall of functionCalls) {
        if (funcCall.name === "search_job_listings") {
          const { query, sites = [] } = funcCall.args;

          // Configure search for job sites
          const searchConfig = {
            query: `${query} job openings`,
            searchDepth: "advanced",
            includeAnswer: true,
            includeRawContent: true,
            maxResults: 5,
          };

          // Add specific sites if provided
          if (sites.length > 0) {
            searchConfig.includeDomains = sites;
          } else {
            // Default job sites
            searchConfig.includeDomains = [
              "linkedin.com/jobs",
              "indeed.com",
              "glassdoor.com/Job",
              "ziprecruiter.com",
              "monster.com",
            ];
          }

          const searchResults = await tavilyClient.search(searchConfig);

          toolResults.push({
            name: funcCall.name,
            response: {
              results: searchResults.results,
              answer: searchResults.answer,
            },
          });
        }
      }

      // Send tool results back to model
      const followupResult = await chat.sendMessage([
        {
          functionResponse: {
            name: "search_job_listings",
            response: {
              results: toolResults[0].response.results,
              answer: toolResults[0].response.answer,
            },
          },
        },
      ]);

      const finalResponse = await followupResult.response;
      const finalText = finalResponse.text();

      // Update chat history
      chatHistory.push(
        { role: "user", parts: [{ text: message }] },
        { role: "model", parts: [{ text: finalText }] }
      );
      chatSessions.set(sessionId, chatHistory.slice(-10)); // Keep last 10 messages

      res.json({
        response: finalText,
        toolUsed: true,
        searchResults: toolResults[0].response.results,
      });
    } else {
      // No function call, just return text response
      const text = response.text();

      // Update chat history
      chatHistory.push(
        { role: "user", parts: [{ text: message }] },
        { role: "model", parts: [{ text }] }
      );
      chatSessions.set(sessionId, chatHistory.slice(-10));

      res.json({
        response: text,
        toolUsed: false,
      });
    }
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({
      error: "Failed to process chat message",
      details: error.message,
    });
  }
});

router.post("/clear-session", (req, res) => {
  const { sessionId } = req.body;
  if (sessionId && chatSessions.has(sessionId)) {
    chatSessions.delete(sessionId);
  }
  res.json({ success: true });
});

export default router;
