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
