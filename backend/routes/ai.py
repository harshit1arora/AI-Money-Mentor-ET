from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from ai.llm import ask_llama

router = APIRouter()

# Request schema
class AskRequest(BaseModel):
    query: str

# Response route
@router.post("/ask")
async def ask_ai(data: AskRequest):
    if not data.query:
        raise HTTPException(status_code=400, detail="Query is required")

    response = ask_llama(data.query)

    return {
        "query": data.query,
        "response": response
    }