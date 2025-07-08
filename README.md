# 🧠 SmartDoc Assistant

SmartDoc Assistant is a GenAI-powered document comprehension tool that helps users:

- 📄 Summarize uploaded PDFs or TXT documents  
- ❓ Ask contextual questions based on the uploaded document  
- 🧠 Take auto-generated quizzes to test understanding  

---

## ✨ Features

# 📄 Upload Documents
- Upload .pdf or .txt files for intelligent analysis.
# 🧠 AI-Powered Summarization
- Generate concise summaries of uploaded documents using LLMs.
# ❓ Ask Contextual Questions
- Ask questions based on document content.
- Remembers context from previously asked questions.
- Option to reset context anytime.
- Stores and displays previous questions in the UI.
# 🧩 Generate Logic-Based Quizzes
- Automatically generate quiz questions that require reasoning and inference.
# ✅ Evaluate Quiz Answers
- Get feedback with grades, justifications, and concise insights based on your answers.
# 💾 Local Upload History
- Persists previously uploaded files via localStorage.
- View all uploaded documents in the sidebar.
- Delete individual files by clicking ❌.
-Clear all files with a single click. 

---

## 🧱 Architecture & Reasoning Flow

Frontend (React) ◄───► Backend (FastAPI)

User Uploads File ─────► /upload
└─► Extracts, chunks & indexes text
└─► Embeds chunks for retrieval

User Asks Question ─────► /ask
└─► Retrieves relevant chunks
└─► Constructs prompt with context & history
└─► Calls LLM (local or remote)

Generate Quiz ─────► /quiz/generate
└─► Context-based question generation (LLM)

Evaluate Answers ─────► /quiz/evaluate
└─► Feedback per answer using LLM

---


> 🧠 Uses embedding-based chunk retrieval for contextual Q&A and quiz generation. Context + session history helps create accurate prompts.

---

## ⚙️ Tech Stack

| Layer       | Tech                             |
|-------------|----------------------------------|
| Frontend    | React + CSS      |
| Backend     | FastAPI                          |
| Embedding   | SentenceTransformers / HF Models |
| LLM         | Local LLM with Ollama            |
| Storage     | Browser LocalStorage             |
| PDF Parsing | PyMuPDF / pdfminer               |

---

## 🚀 Setup Instructions

1️⃣ Clone the Repository
git clone https://github.com/SurajitM0nd0l/SmartDoc-Assistant.git
cd SmartDoc-Assistant

2️⃣ Backend Setup(/backend)
cd backend

Create virtual environment
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows

Install dependencies
pip install -r requirements.txt

Start FastAPI server
uvicorn main:app --reload
Runs at http://localhost:8000

3️⃣ Frontend Setup (/frontend)
cd ../frontend

Install dependencies
npm install

Create .env file
echo "VITE_API_BASE_URL=http://localhost:8000" > .env

Start React app
npm run dev
Runs at http://localhost:5173


## 🧰 Local LLM with Ollama

1. Install Ollama: 
Go to ollama.com/download and install for macOS, Windows, or Linux.
Verify installation:
ollama --version

3. Pull a Model: 
ollama pull mistral

5. Run the Model: 
ollama run mistral

## 🧪 Example Workflow

Upload a research paper (PDF/TXT)
View the AI-generated summary
Ask contextual questions (e.g., "What is the core contribution?")
Generate a quiz → Submit answers → Receive intelligent feedback
