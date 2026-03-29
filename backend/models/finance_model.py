from sqlalchemy import Column, Integer, Float, ForeignKey, String
from db.database import Base

class Finance(Base):
    __tablename__ = "finance"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"))
    income = Column(Float)
    expenses = Column(Float)
    savings = Column(Float)
    debt = Column(Float)