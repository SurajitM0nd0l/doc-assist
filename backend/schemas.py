# backend/schemas.py
from pydantic import BaseModel
from typing import List

class AskRequest(BaseModel):
    question: str
    session_id: str  # added

class AskResponse(BaseModel):
    answer: str

class UploadResponse(BaseModel):
    message: str
    summary: str

class QuizEvalRequest(BaseModel):
    questions: List[str]
    answers: List[str]
