from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import json
import os
from typing import List

from database import database
from models.game import Player, GameState, Position
from routers import game, players, auth
from services.game_manager import GameManager

# Game manager instance
game_manager = GameManager()

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
app.include_router(auth.router, prefix="/players", tags=["players"])
app.include_router(players.router, prefix="/players", tags=["players management"])
app.include_router(game.router, prefix="/game", tags=["game"])

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

# WebSocket endpoint for real-time game updates
@app.websocket("/ws/{player_id}")
async def websocket_endpoint(websocket: WebSocket, player_id: str):
    await game_manager.connect(player_id, websocket)
    try:
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)
            await game_manager.handle_message(player_id, message)
    except WebSocketDisconnect:
        await game_manager.disconnect(player_id)
    except Exception as e:
        print(f"WebSocket error: {e}")
        await game_manager.disconnect(player_id) 