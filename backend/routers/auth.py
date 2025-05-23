from fastapi import APIRouter, HTTPException, status
from datetime import datetime
from bson import ObjectId

from models.game import Player, PlayerCreate
from database import database

router = APIRouter()

@router.post("/create-player", response_model=dict)
async def create_player(player_data: PlayerCreate):
    # Check if username already exists
    existing_player = database.players.find_one({"username": player_data.username})
    if existing_player:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already taken"
        )
    
    # Create new player
    new_player_dict = {
        "username": player_data.username,
        "score": 0,
        "level": 1,
        "experience": 0,
        "created_at": datetime.utcnow(),
        "is_active": True
    }
    
    result = database.players.insert_one(new_player_dict)
    
    if result.inserted_id:
        return {
            "message": "Player created successfully", 
            "player_id": str(result.inserted_id),
            "username": player_data.username
        }
    else:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create player"
        )

@router.get("/player/{username}")
async def get_player_by_username(username: str):
    player_doc = database.players.find_one({"username": username})
    if not player_doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Player not found"
        )
    
    # Convert ObjectId to string for JSON serialization
    player_doc["_id"] = str(player_doc["_id"])
    return player_doc 