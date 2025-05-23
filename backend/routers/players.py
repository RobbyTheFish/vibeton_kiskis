from fastapi import APIRouter, HTTPException, status
from typing import List
from bson import ObjectId
from datetime import datetime

from models.game import Player, PlayerUpdate, PlayerCreate
from database import database

router = APIRouter()

@router.post("/", response_model=dict)
async def create_player(player_data: PlayerCreate):
    """Create a new player"""
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
        # Return player data with ID
        return {
            "id": str(result.inserted_id),
            "username": player_data.username,
            "score": 0,
            "level": 1
        }
    else:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create player"
        )

@router.get("/", response_model=List[dict])
async def get_players(skip: int = 0, limit: int = 100):
    """Get list of players"""
    players = list(database.players.find().skip(skip).limit(limit))
    # Convert ObjectId to string for JSON serialization
    for player in players:
        player["_id"] = str(player["_id"])
    return players

@router.get("/{player_id}", response_model=dict)
async def get_player(player_id: str):
    """Get player by ID"""
    try:
        player_doc = database.players.find_one({"_id": ObjectId(player_id)})
        if not player_doc:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Player not found"
            )
        # Convert ObjectId to string and format for frontend
        return {
            "id": str(player_doc["_id"]),
            "username": player_doc["username"],
            "score": player_doc.get("score", 0),
            "level": player_doc.get("level", 1)
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid player ID"
        )

@router.put("/{player_id}", response_model=dict)
async def update_player(player_id: str, player_update: PlayerUpdate):
    """Update player information"""
    try:
        # Check if player exists
        player_doc = database.players.find_one({"_id": ObjectId(player_id)})
        if not player_doc:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Player not found"
            )
        
        # Update player
        update_data = player_update.dict(exclude_unset=True)
        if update_data:
            result = database.players.update_one(
                {"_id": ObjectId(player_id)},
                {"$set": update_data}
            )
            
            if result.modified_count == 0:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="No changes made"
                )
        
        # Return updated player
        updated_player = database.players.find_one({"_id": ObjectId(player_id)})
        updated_player["_id"] = str(updated_player["_id"])
        return updated_player
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to update player: {str(e)}"
        )

@router.delete("/{player_id}")
async def delete_player(player_id: str):
    """Delete player"""
    try:
        # Check if player exists
        player_doc = database.players.find_one({"_id": ObjectId(player_id)})
        if not player_doc:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Player not found"
            )
        
        # Delete player
        result = database.players.delete_one({"_id": ObjectId(player_id)})
        
        if result.deleted_count == 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to delete player"
            )
        
        return {"message": "Player deleted successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to delete player: {str(e)}"
        )

@router.get("/leaderboard/top", response_model=List[dict])
async def get_leaderboard(limit: int = 10):
    """Get top players by score"""
    players = list(
        database.players
        .find()
        .sort("score", -1)
        .limit(limit)
    )
    # Convert ObjectId to string for JSON serialization
    for player in players:
        player["_id"] = str(player["_id"])
    return players 