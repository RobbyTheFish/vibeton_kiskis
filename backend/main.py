from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from database import database
from routers import auth, players

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await database.connect()
    print("Connected to MongoDB")
    yield
    # Shutdown
    await database.disconnect()
    print("Disconnected from MongoDB")

app = FastAPI(
    title="Vibeton Game API",
    description="Backend API for Vibeton web game",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(players.router, prefix="/api/players", tags=["players"])

@app.get("/")
async def root():
    return {"message": "Vibeton Game API", "status": "running"}

@app.get("/health")
async def health_check():
    try:
        # Check database connection
        await database.ping()
        return {"status": "healthy", "database": "connected"}
    except Exception as e:
        return {"status": "unhealthy", "database": "disconnected", "error": str(e)} 