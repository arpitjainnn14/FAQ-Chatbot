#Question Analyzer
from sentence_transformers import SentenceTransformer
import numpy as np
from main import get_db, QA

#Setting up the AI Model
def setup_analyzer():
    model = SentenceTransformer('all-MiniLM-L6-v2')
    return {'model': model}

def answer_question(user_question, analyzer):
    # Always get fresh data from database
    db = next(get_db())
    qa_data = db.query(QA).all()
    db.close()
    
    if not qa_data:
        return "No questions in database yet"
    
    #Sentence Transformers accepts the data in Lists
    questions = [qa.question for qa in qa_data]
    answers = [qa.answer for qa in qa_data]
    model = analyzer['model']
    
    # Convert text into vectors
    question_numbers = model.encode(questions)
    user_numbers = model.encode([user_question])
    
    # Finding the best similarity
    scores = np.dot(question_numbers, user_numbers.T).flatten() #Gives Probabilities
    best_match = np.argmax(scores)
    best_score = scores[best_match]
    
    print(f"Best match: {questions[best_match]} (score: {best_score})")
    
    # If score is good enough, return the answer
    if best_score > 0.4:
        return answers[best_match]
    else:
        return "Sorry, I don't know that. Try asking something else!"

#CRUD Functions
from sqlalchemy.orm import Session
from main import QA, QACreate


def create_qa(db: Session, payload: QACreate):
    new_qa = QA(question=payload.question, answer=payload.answer)
    db.add(new_qa)
    db.commit()
    db.refresh(new_qa)
    return new_qa

def get_all_qas(db: Session):
    return db.query(QA).all()

def get_qa_by_id(db: Session, qa_id: int):
    return db.query(QA).filter(QA.id == qa_id).first()

def update_qa(db: Session, qa_id: int, payload: QACreate):
    qa = get_qa_by_id(db, qa_id)
    if not qa:
        return None
    qa.question = payload.question
    qa.answer = payload.answer
    db.commit()
    db.refresh(qa)
    return qa

def delete_qa(db: Session, qa_id: int):
    qa = get_qa_by_id(db, qa_id)
    if not qa:
        return False
    db.delete(qa)
    db.commit()
    return True
