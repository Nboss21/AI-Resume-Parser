import axios from "axios";

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // 30 seconds
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error("API Error:", error);

    let errorMessage = "An unexpected error occurred";

    if (error.response) {
      // Server responded with error
      errorMessage =
        error.response.data?.error ||
        error.response.data?.message ||
        error.response.statusText;

      // Handle specific status codes
      if (error.response.status === 401) {
        // Unauthorized - redirect to login
        localStorage.removeItem("token");
        window.location.href = "/login";
      } else if (error.response.status === 429) {
        errorMessage = "Too many requests. Please try again later.";
      }
    } else if (error.request) {
      // Request made but no response
      errorMessage =
        "Unable to connect to server. Please check if the backend is running.";
    } else {
      // Something else happened
      errorMessage = error.message;
    }

    // Show error message
    if (typeof window !== "undefined") {
      // Create a simple alert or update UI state
      const errorEvent = new CustomEvent("api-error", { detail: errorMessage });
      window.dispatchEvent(errorEvent);
    }

    return Promise.reject({
      message: errorMessage,
      status: error.response?.status,
      data: error.response?.data,
    });
  }
);

// Resume API
export const resumeAPI = {
  parseResume: (file) => {
    const formData = new FormData();
    formData.append("resume", file);

    return apiClient.post("/resume/parse", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  parseResumeText: (text) => {
    return apiClient.post("/resume/parse-text", { text });
  },
};

// Chat API
export const chatAPI = {
  sendMessage: (message, resumeData, conversationHistory = []) => {
    return apiClient.post("/chat/message", {
      message,
      resumeData,
      conversationHistory,
    });
  },

  searchJobs: (skills, location = "", experienceLevel = "") => {
    return apiClient.post("/chat/search-jobs", {
      skills,
      location,
      experienceLevel,
    });
  },

  suggestJobs: (resumeData) => {
    return apiClient.post("/chat/suggest-jobs", {
      resumeData,
    });
  },
};

// Health check
export const healthAPI = {
  check: () => apiClient.get("/health"),
  checkGemini: () => apiClient.get("/health/gemini"),
};

export default apiClient;
