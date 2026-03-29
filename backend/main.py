from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from db.database import engine, Base

from routes import user, finance, advisor, tax, ai

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(user.router, prefix="/user")
app.include_router(finance.router, prefix="/finance")
app.include_router(advisor.router, prefix="/advisor")
app.include_router(tax.router, prefix="/tax")
app.include_router(ai.router, prefix="/ai")

@app.get("/")
def root():
    return {"message": "AI Money Mentor Running"}