from pydantic import BaseModel

class FinanceCreate(BaseModel):
    user_id: str
    income: float
    expenses: float
    savings: float
    debt: float