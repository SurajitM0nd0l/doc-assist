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

Frontend (React) Backend (FastAPI)

User Uploads File ─────► /upload (extracts, chunks & indexes)
│
└─► Embedder encodes chunks for retrieval

User Asks Question ─────► /ask
│
└─► Embedding-based context retrieval
└─► Constructed prompt with history/context
└─► call_local_llm(system, prompt)

Generate Quiz ─────► /quiz/generate
└─► Contextual logic question generation (LLM)

Evaluate Answers ─────► /quiz/evaluate
└─► LLM gives feedback per answer


> 🧠 The system uses embedding-based chunk retrieval for question answering and quiz generation. The context + session history is used to construct prompts sent to an LLM (local or remote).

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

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/SurajitM0nd0l/SmartDoc-Assistant.git
cd SmartDoc-Assistant

Backend Setup (/backend)
📦 Create virtual environment and install dependencies

cd backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows

pip install -r requirements.txt
▶️ Run FastAPI server

uvicorn main:app --reload
Backend runs at http://localhost:8000

3️⃣ Frontend Setup (/frontend)
📦 Install Node dependencies

cd ../frontend
npm install
🛠️ Create .env file

VITE_API_BASE_URL=http://localhost:8000
▶️ Run React app

npm run dev
Frontend runs at http://localhost:5173

🧪 Example Workflow

Upload a research paper PDF
View AI-generated summary
Ask questions like “What is the core contribution?”
Generate a quiz → Fill in answers → Receive feedback
📌 TODO / Future Improvements

 Store file content for re-opened documents
 Persist vector store (e.g., FAISS / Chroma)
 Add login-based user sessions
 Add support for DOCX/HTML files
 Replace call_local_llm with production-grade LLM APIs

Install Ollama
Go to https://ollama.com/download
Download and install Ollama for macOS, Windows, or Linux.

After installation, run this in your terminal to ensure it's working:
ollama --version
 Pull a Model
Choose a model like llama3, mistral, or gemma.

ollama pull llama3
This downloads and sets up the model locally.

 Run Ollama Server
ollama run llama3

---

Let me know if you'd like deployment instructions, a badge-enhanced header, or a version with screenshots!
