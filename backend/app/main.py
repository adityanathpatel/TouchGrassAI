from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.config import get_settings
from app.database import Base, engine
from app.routers import adventures, ai, health, journal, observations, privacy, routes

Base.metadata.create_all(bind=engine)
settings = get_settings()

app = FastAPI(title="TouchGrass AI", version="1.0.0")
origins = [item.strip() for item in settings.cors_origins.split(",") if item.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins or ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(adventures.router)
app.include_router(routes.router)
app.include_router(observations.router)
app.include_router(journal.router)
app.include_router(ai.router)
app.include_router(privacy.router)


@app.exception_handler(Exception)
async def unhandled(request: Request, exc: Exception):
    if isinstance(exc, (HTTPException, StarletteHTTPException)):
        return JSONResponse(status_code=exc.status_code, content={"detail": exc.detail})
    return JSONResponse(
        status_code=500,
        content={"detail": "Something went wrong. Try Demo Mode or check local AI."},
    )
