

# 🤖 AI Resume Parser

An intelligent web application that uses artificial intelligence to automatically extract, analyze, and structure information from resume documents (like PDFs and Word files). It transforms unstructured resume text into organized, actionable data for recruiters and hiring platforms.

---

## 📋 Table of Contents
- [✨ Overview](#-overview)
- [🚀 Features](#-features)
- [🛠 Tech Stack](#-tech-stack)
- [📁 Project Structure](#-project-structure)
- [⚙️ Installation & Setup](#️-installation--setup)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

## ✨ Overview
Manually screening resumes is a time-consuming and inconsistent task for recruiters. This **AI Resume Parser** automates the process by leveraging modern AI and NLP techniques to quickly identify key candidate information such as skills, experience, education, and contact details. It provides a clean, user-friendly interface to upload documents and view parsed results in a structured JSON or form format.

## 🚀 Features
- **📄 Multi-Format Support**: Upload and parse resumes in PDF, DOCX, and plain text formats.
- **🔍 Intelligent Information Extraction**: Accurately identifies and categorizes:
    - Personal Details (Name, Email, Phone, Location)
    - Work Experience (Job titles, companies, durations, descriptions)
    - Education (Degrees, institutions, graduation years)
    - Skills (Technical, professional, and language skills)
    - Certifications & Achievements
- **🧠 NLP-Powered Analysis**: Uses advanced natural language processing to understand context and relationships between entities.
- **📊 Structured Output**: Presents parsed data in a clean, structured JSON format and an easy-to-read web interface.
- **⚡ Fast & Scalable Backend**: Built with a Node.js/Express.js server for efficient processing.
- **🎨 Modern & Responsive UI**: A clean frontend built with HTML, CSS, and JavaScript for a smooth user experience.

## 🛠 Tech Stack
| Layer | Technology |
| :--- | :--- |
| **Frontend** | Tailwind CSS , React |
| **Backend** | Node.js, Express.js |
| **AI/NLP Engine** | (To be integrated, e.g., TensorFlow.js, spaCy, or a third-party API(Gemini) |
| **Package Manager** | npm |
| **Version Control** | Git & GitHub |

## 📁 Project Structure
```
AI-Resume-Parser/
├── frontend/                 # Client-side application
│   ├── index.html           # Main HTML file
│   ├── style.css            # Main stylesheet
│   ├── script.js            # Frontend logic (file upload, API calls, UI updates)
│   └── assets/              # Images, icons, etc.
├── backend/                 # Server-side application
│   ├── server.js            # Main Express server file
│   ├── package.json         # Backend dependencies
│   ├── routes/              # API route definitions
│   │   └── parseResume.js   # Endpoint for resume parsing
│   ├── utils/               # Helper functions
│   │   └── parserEngine.js  # Core AI parsing logic
│   └── uploads/             # Temporary folder for uploaded files
└── README.md                # This file
```

## ⚙️ Installation & Setup
Follow these steps to run the project locally on your machine.

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or later) and npm installed.
- Git.

### 1. Clone the Repository
```bash
git clone https://github.com/Nboss21/AI-Resume-Parser.git
cd AI-Resume-Parser
```

### 2. Set Up the Backend Server
```bash
# Navigate to the backend directory
cd backend

# Install all required dependencies
npm install

# Start the development server
# (Update the command in package.json if necessary, e.g., "node server.js")
npm start
```
The backend server should now be running (typically at `http://localhost:5000`).

### 3. Set Up the Frontend
Open a new terminal window in the main project directory.
```bash
# Navigate to the frontend folder
cd frontend

# You can use any local HTTP server to serve the frontend.
# For example, using Python:
python3 -m http.server 8000

# Or using Node.js with 'serve':
npx serve .
```
The frontend will be available (for example, at `http://localhost:8000`).

### 4. Configure the Application
- Ensure the frontend's `script.js` file is configured to send API requests to the correct backend URL (e.g., `http://localhost:5000/api/parse`).

## 🧪 Usage Guide
1. **Access the Application**: Open your browser and go to the frontend URL (e.g., `http://localhost:8000`).
2. **Upload a Resume**: Use the file picker to select a resume (PDF or DOCX).
3. **Parse**: Click the "Upload and Parse" button.
4. **View Results**: The parsed information will be displayed in a structured format on the webpage. You can also view the raw JSON output from the backend API.

## 🤝 Contributing
Contributions are welcome! If you'd like to improve the AI-Resume-Parser, please follow these steps:

1. **Fork the Project**.
2. **Create a Feature Branch** (`git checkout -b feature/AmazingFeature`).
3. **Commit your Changes** (`git commit -m 'Add some AmazingFeature'`).
4. **Push to the Branch** (`git push origin feature/AmazingFeature`).
5. **Open a Pull Request**.

Please ensure your code follows the project's style and includes appropriate tests or updates to documentation.

## 📄 License
This project does not currently have a specified license. For usage or contribution rights, please contact the repository owner [@Nboss21](https://github.com/Nboss21).

---
### 💡 Future Roadmap (Ideas)
- Integration with a machine learning library (like TensorFlow.js) for on-premise parsing.
- Adding a dashboard to compare multiple candidates.
- Exporting parsed data to CSV or ATS (Applicant Tracking System) formats.
- Implementing user authentication to save and manage parsed resumes.

---
<div align="center">
<sub>Built with ❤️ by <a href="https://github.com/Nboss21">Nboss21</a>. </sub>
</div>

