// File size constants
export const FILE_SIZE_LIMIT = 5 * 1024 * 1024; // 5MB in bytes

// File type constants
export const ALLOWED_FILE_TYPES = {
  "application/pdf": [".pdf"],
  "application/msword": [".doc"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
    ".docx",
  ],
  "text/plain": [".txt"],
};

// Extract file extension from filename
export const getFileExtension = (filename) => {
  return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
};

// Format file size to human readable format
export const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

// Validate file type
export const validateFileType = (file, allowedTypes = ALLOWED_FILE_TYPES) => {
  const isValidType = Object.keys(allowedTypes).some((type) => {
    return (
      file.type === type ||
      allowedTypes[type]?.includes("." + getFileExtension(file.name))
    );
  });

  if (!isValidType) {
    const allowedExtensions = Object.values(allowedTypes)
      .flat()
      .map((ext) => ext.replace(".", "").toUpperCase())
      .join(", ");

    return {
      valid: false,
      error: `Invalid file type. Allowed types: ${allowedExtensions}`,
    };
  }

  return { valid: true };
};

// Validate file size
export const validateFileSize = (file, maxSize = FILE_SIZE_LIMIT) => {
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File is too large. Maximum size is ${formatFileSize(maxSize)}`,
    };
  }

  return { valid: true };
};

// Read file as text (for text-based files)
export const readFileAsText = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      resolve(event.target.result);
    };

    reader.onerror = (error) => {
      reject(new Error("Failed to read file: " + error));
    };

    reader.readAsText(file);
  });
};

// Read file as array buffer (for binary files like PDF, DOCX)
export const readFileAsArrayBuffer = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      resolve(event.target.result);
    };

    reader.onerror = (error) => {
      reject(new Error("Failed to read file: " + error));
    };

    reader.readAsArrayBuffer(file);
  });
};

// Convert array buffer to base64
export const arrayBufferToBase64 = (buffer) => {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;

  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }

  return btoa(binary);
};

// Extract text from PDF (client-side, fallback)
export const extractTextFromPDF = async (pdfBuffer) => {
  try {
    // Note: In a real implementation, you might use pdf.js or similar
    // This is a simplified version
    console.warn(
      "Client-side PDF text extraction is limited. Using backend extraction is recommended."
    );

    // Return a placeholder or use a library like pdf-parse
    return "PDF text extraction requires backend processing. Please use the file upload.";
  } catch (error) {
    throw new Error("Failed to extract text from PDF: " + error.message);
  }
};

// Generate file preview (for images and PDFs)
export const generateFilePreview = (file) => {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      // For non-image files, return file icon info
      resolve({
        type: "file",
        icon: getFileIcon(file.type),
        color: getFileIconColor(file.type),
      });
      return;
    }

    const reader = new FileReader();

    reader.onload = (event) => {
      resolve({
        type: "image",
        url: event.target.result,
        width: 200,
        height: 200,
      });
    };

    reader.onerror = (error) => {
      reject(new Error("Failed to generate preview: " + error));
    };

    reader.readAsDataURL(file);
  });
};

// Get appropriate icon for file type
export const getFileIcon = (fileType) => {
  if (fileType.includes("pdf")) return "picture_as_pdf";
  if (fileType.includes("word") || fileType.includes("document"))
    return "description";
  if (fileType.includes("text")) return "text_snippet";
  return "insert_drive_file";
};

// Get color for file icon
export const getFileIconColor = (fileType) => {
  if (fileType.includes("pdf")) return "#f40f02"; // Red for PDF
  if (fileType.includes("word") || fileType.includes("document"))
    return "#2b579a"; // Blue for Word
  if (fileType.includes("text")) return "#757575"; // Grey for text
  return "#5f6368"; // Default grey
};

// Sanitize filename (remove special characters)
export const sanitizeFilename = (filename) => {
  return filename
    .replace(/[^a-zA-Z0-9.\-_]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "");
};

// Check if file is resume based on name or content type
export const isLikelyResume = (file) => {
  const filename = file.name.toLowerCase();
  const commonResumeNames = [
    "resume",
    "cv",
    "curriculum",
    "vitae",
    "履歷",
    "简历",
    "レジュメ",
  ];

  // Check filename
  if (commonResumeNames.some((name) => filename.includes(name))) {
    return true;
  }

  // Check file type
  const allowedTypes = Object.keys(ALLOWED_FILE_TYPES);
  if (allowedTypes.includes(file.type)) {
    return true;
  }

  return false;
};

// Extract skills from text (basic implementation)
export const extractSkillsFromText = (text) => {
  const commonSkills = [
    "javascript",
    "python",
    "react",
    "node",
    "java",
    "aws",
    "sql",
    "mongodb",
    "typescript",
    "vue",
    "angular",
    "docker",
    "kubernetes",
    "git",
    "github",
    "html",
    "css",
    "sass",
    "less",
    "bootstrap",
    "tailwind",
    "redux",
    "graphql",
    "rest api",
    "express",
    "nestjs",
    "django",
    "flask",
    "spring",
    "laravel",
    "postgresql",
    "mysql",
    "redis",
    "elasticsearch",
    "firebase",
    "heroku",
    "jenkins",
    "travis",
    "circleci",
    "ansible",
    "terraform",
    "linux",
    "bash",
    "agile",
    "scrum",
    "kanban",
    "jira",
    "confluence",
    "figma",
    "sketch",
    "photoshop",
    "illustrator",
    "xd",
    "invision",
    "zeplin",
  ];

  const foundSkills = [];
  const lowerText = text.toLowerCase();

  commonSkills.forEach((skill) => {
    if (lowerText.includes(skill.toLowerCase())) {
      foundSkills.push(skill);
    }
  });

  return [...new Set(foundSkills)]; // Remove duplicates
};

// Calculate reading time for text
export const calculateReadingTime = (text) => {
  const wordsPerMinute = 200;
  const wordCount = text.trim().split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / wordsPerMinute);
  return readingTime;
};

// Truncate text with ellipsis
export const truncateText = (text, maxLength = 100) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

// Format date for display
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Download file helper
export const downloadFile = (content, filename, contentType = "text/plain") => {
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Generate unique filename with timestamp
export const generateUniqueFilename = (originalName) => {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8);
  const extension = getFileExtension(originalName) || "";
  const baseName = originalName.replace(/\.[^/.]+$/, "");

  return `${baseName}_${timestamp}_${randomString}${
    extension ? "." + extension : ""
  }`;
};

// Validate resume file (combined validation)
export const validateResumeFile = (file) => {
  // Check file type
  const typeValidation = validateFileType(file);
  if (!typeValidation.valid) {
    return typeValidation;
  }

  // Check file size
  const sizeValidation = validateFileSize(file);
  if (!sizeValidation.valid) {
    return sizeValidation;
  }

  // Check if file looks like a resume
  if (!isLikelyResume(file)) {
    console.warn(
      'File may not be a resume. Consider renaming it to include "resume" or "cv".'
    );
  }

  return { valid: true };
};

export default {
  FILE_SIZE_LIMIT,
  ALLOWED_FILE_TYPES,
  getFileExtension,
  formatFileSize,
  validateFileType,
  validateFileSize,
  readFileAsText,
  readFileAsArrayBuffer,
  arrayBufferToBase64,
  extractTextFromPDF,
  generateFilePreview,
  getFileIcon,
  getFileIconColor,
  sanitizeFilename,
  isLikelyResume,
  extractSkillsFromText,
  calculateReadingTime,
  truncateText,
  formatDate,
  downloadFile,
  generateUniqueFilename,
  validateResumeFile,
};
