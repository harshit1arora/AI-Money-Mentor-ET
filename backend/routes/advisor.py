from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from db.database import SessionLocal
from models.finance_model import Finance
from ai.llm import ask_llama
from ai.prompts import advisor_prompt

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/chat/{user_id}")
def chat(user_id: str, db: Session = Depends(get_db)):
    fin = db.query(Finance).filter(Finance.user_id == user_id).first()
    if not fin:
        return {"error": "Finance data not found"}

    data = {
        "income": fin.income,
        "expenses": fin.expenses,
        "savings": fin.savings,
        "debt": fin.debt
    }

    prompt = advisor_prompt(data)
    response = ask_llama(prompt)

    return {"response": response}