import { tavily } from "@tavily/core"; // Tavily client
import { GoogleGenerativeAI } from "@google/generative-ai"; // Gemini AI client
import dotenv from "dotenv";
dotenv.config();

// Initialize services
const tavilyClient = tavily({ apiKey: process.env.TAVILY_API_KEY });
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Initialize Gemini model
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-pro",
  generationConfig: {
    temperature: 0.7,
    topK: 1,
    topP: 1,
    maxOutputTokens: 2048,
  },
});

// Search jobs using Tavily
export async function searchJobs(skills, location = "", experienceLevel = "") {
  try {
    let query = `job openings for ${skills.join(", ")}`;
    if (location) query += ` in ${location}`;
    if (experienceLevel) query += ` ${experienceLevel} level`;
    query +=
      " site:linkedin.com OR site:indeed.com OR site:glassdoor.com OR site:monster.com";

    const searchResults = await tavilyClient.search(query, {
      maxResults: 10,
      searchDepth: "advanced",
      includeRawContent: true,
    });

    const jobs = searchResults.results
      .map((result) => ({
        title: result.title,
        company: extractCompany(result.title, result.content),
        location: extractLocation(result.content) || location,
        description: result.content.substring(0, 300) + "...",
        url: result.url,
        source: result.url.includes("linkedin")
          ? "LinkedIn"
          : result.url.includes("indeed")
          ? "Indeed"
          : result.url.includes("glassdoor")
          ? "Glassdoor"
          : "Other",
        date: new Date().toISOString().split("T")[0],
      }))
      .filter(
        (job) =>
          job.title.toLowerCase().includes("job") ||
          job.description.toLowerCase().includes("job")
      );

    return jobs.slice(0, 5);
  } catch (error) {
    console.error("Error in searchJobs:", error);
    throw error;
  }
}

// Chat with Gemini agent
export async function chatWithAgent(
  message,
  resumeData,
  conversationHistory = []
) {
  try {
    const systemMessage = `You are a helpful job hunting assistant. 
    You have access to the user's resume data and can search for relevant job openings.
    Resume Context:
    - Name: ${resumeData?.name || "Not specified"}
    - Skills: ${resumeData?.skills?.join(", ") || "Not specified"}
    - Experience: ${
      resumeData?.experience
        ?.map((exp) => `${exp.title} at ${exp.company}`)
        .join("; ") || "Not specified"
    }
    - Education: ${
      resumeData?.education
        ?.map((edu) => `${edu.degree} from ${edu.institution}`)
        .join("; ") || "Not specified"
    }
    
    Your tasks:
    1. Help users find jobs matching their skills
    2. Suggest career advice based on their profile
    3. Use Tavily search when users ask for job openings
    4. Be conversational and helpful`;

    const fullPrompt = `${systemMessage}

    Conversation History:
    ${conversationHistory
      .map(
        (msg) => `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`
      )
      .join("\n")}

    User: ${message}

    Assistant:`;

    // Generate Gemini response
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();

    // Check if the message requires a job search
    const searchKeywords = [
      "search for jobs",
      "find jobs",
      "job openings",
      "look for positions",
    ];
    let jobs = [];
    if (searchKeywords.some((kw) => text.toLowerCase().includes(kw))) {
      const skills = resumeData?.skills || extractSkillsFromMessage(message);
      jobs = await searchJobs(
        skills,
        extractLocationFromMessage(message),
        extractExperienceLevel(message)
      );
    }

    const updatedHistory = [
      ...conversationHistory,
      { role: "user", content: message },
      { role: "assistant", content: text },
    ];

    return { message: text, jobs, conversationHistory: updatedHistory };
  } catch (error) {
    console.error("Error in chatWithAgent:", error);
    return {
      message:
        "I apologize, but I'm having trouble processing your request right now. Please try again later.",
      jobs: [],
      conversationHistory,
    };
  }
}

// Helper functions
function extractCompany(title, content) {
  const companyPatterns = [
    /at\s+([A-Z][a-zA-Z\s&]+?)(?:\s+|$|,|\.)/i,
    /-\s+([A-Z][a-zA-Z\s&]+?)\s+job/i,
    /company:\s*([^\n,.]+)/i,
  ];
  for (const pattern of companyPatterns) {
    const match = (title + " " + content).match(pattern);
    if (match && match[1]) return match[1].trim();
  }
  return "Company not specified";
}

function extractLocation(content) {
  const match = content.match(/(?:location|based in|in)\s+([^\n,.]+)/i);
  return match ? match[1].trim() : null;
}

function extractSkillsFromMessage(message) {
  const commonSkills = [
    "javascript",
    "python",
    "react",
    "node",
    "java",
    "aws",
    "sql",
    "mongodb",
  ];
  return commonSkills.filter((skill) => message.toLowerCase().includes(skill));
}

function extractLocationFromMessage(message) {
  const match = message.match(/\bin\s+([^\s,.]+(?:\s+[^\s,.]+)*)/i);
  return match ? match[1] : "";
}

function extractExperienceLevel(message) {
  const msg = message.toLowerCase();
  if (msg.includes("entry") || msg.includes("junior")) return "entry";
  if (msg.includes("senior") || msg.includes("lead")) return "senior";
  if (msg.includes("mid") || msg.includes("intermediate")) return "mid";
  return "";
}
