# backend/main.py

from fastapi import Request
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from schemas import AskRequest, AskResponse, QuizEvalRequest, UploadResponse
from document_utils import extract_text_from_pdf, chunk_text
from embedding_utils import Embedder
from llm_utils import call_local_llm

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

embedder = Embedder()

conversation_memory = {}  # Store past Q&A per session_id

@app.post("/upload", response_model=UploadResponse)
async def upload_file(file: UploadFile = File(...)):
    content = await file.read()
    text = extract_text_from_pdf(content)
    chunks = chunk_text(text)
    embedder.encode_and_index(chunks)
    summary = text[:500] + "..."
    return {"message": "Document processed successfully", "summary": summary}

@app.post("/ask", response_model=AskResponse)
async def ask_question(payload: AskRequest):
    session_id = payload.session_id
    history = conversation_memory.get(session_id, [])
    history_text = "\n\n".join([f"Q: {pair['q']}\nA: {pair['a']}" for pair in history])

    context = "\n\n".join(embedder.retrieve_top_chunks(payload.question))
    system = "You are a helpful assistant. Use prior conversation and given context to answer. Justify from source."

    prompt = f"""{history_text}

Context:
{context}

Question: {payload.question}

Answer with justification:"""

    answer = call_local_llm(system, prompt)

    # Save Q&A in memory
    conversation_memory.setdefault(session_id, []).append({
        "q": payload.question,
        "a": answer
    })

    return {"answer": answer}


@app.post("/quiz/generate")
async def generate_quiz():
    context = "\n\n".join(embedder.chunks[:5])
    system = """You are a quiz master. Based on the context, generate 3 standalone quiz questions.
For each question, randomly choose whether it should be multiple-choice or short-answer.

Rules:
- If multiple-choice: Provide 1 correct and 3 incorrect options. Do NOT indicate which is correct.
- If short-answer: Do NOT include options.
- Respond as a JSON list of question objects:
  [{"question": "...", "options": ["..."]}, {"question": "..."}]"""

    prompt = f"""Context:
{context}

Instructions:
Generate quiz as per the rules."""
    
    response = call_local_llm(system, prompt)

    import json
    try:
        questions = json.loads(response)
    except json.JSONDecodeError:
        lines = response.strip().split("\n")
        questions = [{"question": line} for line in lines if line.strip() and not line.lower().startswith("answer")]

    return {"questions": questions}

@app.post("/quiz/evaluate")
async def evaluate_quiz(payload: QuizEvalRequest):
    feedbacks = []
    for q_raw, a in zip(payload.questions, payload.answers):
        q = q_raw["question"] if isinstance(q_raw, dict) else str(q_raw)

        system = "Evaluate the user's answer fairly and concisely. Give a 1-line grade, short feedback, and justification from the source."
        prompt = f"""Question: {q}
Answer: {a}

1. Grade:
2. Feedback:
3. Justification:"""
        feedback = call_local_llm(system, prompt)
        feedbacks.append(feedback)
    return {"feedback": feedbacks}

