from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from db.database import SessionLocal
from models.finance_model import Finance
from schemas.finance_schema import FinanceCreate
from services.scoring import calculate_score
from services.sip_calc import calculate_sip

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/add")
def add_finance(data: FinanceCreate, db: Session = Depends(get_db)):
    # Check if finance data already exists for user
    existing_fin = db.query(Finance).filter(Finance.user_id == data.user_id).first()
    if existing_fin:
        for key, value in data.dict().items():
            setattr(existing_fin, key, value)
        db.commit()
        db.refresh(existing_fin)
        return existing_fin

    fin = Finance(**data.dict())
    db.add(fin)
    db.commit()
    db.refresh(fin)
    return fin

@router.get("/score/{user_id}")
def get_score(user_id: str, db: Session = Depends(get_db)):
    fin = db.query(Finance).filter(Finance.user_id == user_id).first()
    if not fin:
        return {"error": "Finance data not found"}
    score = calculate_score(fin.income, fin.expenses, fin.savings, fin.debt)
    return {"score": score}


@router.get("/sip/{user_id}")
def sip_plan(user_id: str, db: Session = Depends(get_db)):
    
    fin = db.query(Finance).filter(Finance.user_id == user_id).first()

    if not fin:
        return {"error": "Finance data not found"}

    # Use real user data instead of hardcoded values
    sip = calculate_sip(
        fin.savings,   # monthly investment
        12,            # rate (you can customize later)
        60             # months
    )

    return {
        "user_id": user_id,
        "monthly_investment": fin.savings,
        "future_value": sip
    }