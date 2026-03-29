from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from db.database import SessionLocal
from models.user_model import User
from schemas.user_schema import UserCreate

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/create")
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    # Check if user already exists
    existing_user = db.query(User).filter(User.id == user.id).first()
    if existing_user:
        existing_user.name = user.name
        existing_user.age = user.age
        db.commit()
        db.refresh(existing_user)
        return existing_user

    new_user = User(id=user.id, name=user.name, age=user.age)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user