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