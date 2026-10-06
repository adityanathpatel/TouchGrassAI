from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from routers import adventures

Base.metadata.create_all(bind=engine)

app = FastAPI(title="TouchGrass AI", description="Offline-first outdoor adventure API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(adventures.router)

@app.get("/")
def read_root():
    return {"status": "ok", "message": "TouchGrass AI API is running"}
