# 🧠 SmartDoc Assistant

SmartDoc Assistant is a GenAI-powered document comprehension tool that helps users:

- 📄 Summarize uploaded PDFs or TXT documents  
- ❓ Ask contextual questions based on the uploaded document  
- 🧠 Take auto-generated quizzes to test understanding  

---

## ✨ Features

- Upload `.pdf` or `.txt` documents  
- Generate concise AI-based summaries  
- Ask questions and receive contextual answers with justifications  
- Generate logic-based quizzes  
- Get feedback on quiz answers  
- Persist previous uploads locally (via `localStorage`)  

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
| Frontend    | React + Tailwind (optional)      |
| Backend     | FastAPI                          |
| Embedding   | SentenceTransformers / HF Models |
| LLM         | Local model / OpenAI compatible  |
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

🧪 Example Workflow

Upload a research paper (PDF/TXT)
View the AI-generated summary
Ask contextual questions (e.g., "What is the core contribution?")
Generate a quiz → Submit answers → Receive intelligent feedback

🧰 Local LLM with Ollama (Optional)

1. Install Ollama
Go to ollama.com/download and install for macOS, Windows, or Linux.
Verify installation:
ollama --version

3. Pull a Model
ollama pull mistral

5. Run the Model
ollama run mistral
