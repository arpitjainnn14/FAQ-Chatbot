from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from typing import List
import os
from sqlalchemy import create_engine, Column, Integer, Text
from sqlalchemy.orm import sessionmaker, declarative_base
from pydantic import BaseModel

# Database URL (was in db.py)
DATABASE_URL = os.getenv('DATABASE_URL', 'mysql+pymysql://root:Arpit%402004@127.0.0.1:3306/chatbot_db')

engine = create_engine(DATABASE_URL, echo=True, future=True)
local_session = sessionmaker(bind=engine, autoflush=False, autocommit=False, future=True)
Base = declarative_base()

def get_db():
    db = local_session()
    try:
        yield db
    finally:
        db.close()

# ORM model
class QA(Base):
    __tablename__ = 'QuestionAnswer'
    id = Column(Integer, primary_key=True, index=True)
    question = Column(Text, nullable=False)
    answer = Column(Text, nullable=False)


class QACreate(BaseModel):
    question: str
    answer: str

class QAOut(QACreate):
    id: int
    class Config:
        orm_mode = True

class ChatMessage(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str

import crud
from question_analyzer import setup_analyzer, answer_question

# Create database tables if it don't exist yet
Base.metadata.create_all(bind=engine)

# Make the FastAPI app
app = FastAPI()

# Allow frontend to connect to backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve your frontend files (HTML, CSS, JS)
app.mount("/static", StaticFiles(directory="frontend"), name="static")

# Load the AI model and questions when server starts
analyzer = setup_analyzer()


# Chat endpoint
@app.post("/chat", response_model=ChatResponse)
def chat_endpoint(message: ChatMessage):
    answer = answer_question(message.message, analyzer)
    return ChatResponse(response=answer)


# Add a new Q&A
@app.post("/qa", response_model=QAOut)
def create_qa(payload: QACreate, db: Session = Depends(get_db)):
    return crud.create_qa(db, payload)


# Get all Q&A pairs
@app.get("/qa", response_model=List[QAOut])
def get_all_qas(db: Session = Depends(get_db)):
    return crud.get_all_qas(db)


# Get Q&A by ID
@app.get("/qa/{qa_id}", response_model=QAOut)
def get_qa(qa_id: int, db: Session = Depends(get_db)):
    qa = crud.get_qa_by_id(db, qa_id)
    if not qa:
        raise HTTPException(status_code=404, detail="Q&A not found")
    return qa


# Update Q&A
@app.put("/update/{qa_id}", response_model=QAOut)
def update_qa(qa_id: int, payload: QACreate, db: Session = Depends(get_db)):
    qa = crud.update_qa(db, qa_id, payload)
    if not qa:
        raise HTTPException(status_code=404, detail="Q&A not found")
    return qa


# Delete Q&A
@app.delete("/delete/{qa_id}")
def delete_qa(qa_id: int, db: Session = Depends(get_db)):
    success = crud.delete_qa(db, qa_id)
    if not success:
        raise HTTPException(status_code=404, detail="Q&A not found")
    return {"detail": "Deleted"}


# When you visit the root URL, go to the chatbot page
@app.get("/")
def read_root():
    return RedirectResponse(url="/static/index.html")