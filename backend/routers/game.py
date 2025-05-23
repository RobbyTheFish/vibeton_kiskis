from fastapi import APIRouter, HTTPException, status
from typing import List
from bson import ObjectId
from datetime import datetime

from models.game import GameState, GameCreate, GameUpdate
from database import database

router = APIRouter()

@router.post("/", response_model=dict)
async def create_game(game_data: GameCreate, player_username: str):
    """Create a new game session"""
    # Find player by username
    player_doc = database.players.find_one({"username": player_username})
    if not player_doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Player not found"
        )
    
    new_game_dict = {
        "game_type": game_data.game_type,
        "status": "waiting",
        "players": [str(player_doc["_id"])],
        "game_objects": [],
        "current_level": 1,
        "score": 0,
        "settings": game_data.settings,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    result = database.games.insert_one(new_game_dict)
    
    if result.inserted_id:
        created_game = database.games.find_one({"_id": result.inserted_id})
        created_game["_id"] = str(created_game["_id"])
        return created_game
    else:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create game"
        )

@router.get("/", response_model=List[dict])
async def get_games(skip: int = 0, limit: int = 100):
    """Get list of games"""
    games = list(database.games.find().skip(skip).limit(limit))
    for game in games:
        game["_id"] = str(game["_id"])
    return games

@router.get("/{game_id}", response_model=dict)
async def get_game(game_id: str):
    """Get game by ID"""
    try:
        game_doc = database.games.find_one({"_id": ObjectId(game_id)})
        if not game_doc:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Game not found"
            )
        game_doc["_id"] = str(game_doc["_id"])
        return game_doc
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid game ID"
        )

@router.put("/{game_id}", response_model=dict)
async def update_game(game_id: str, game_update: GameUpdate):
    """Update game state"""
    try:
        # Check if game exists
        game_doc = database.games.find_one({"_id": ObjectId(game_id)})
        if not game_doc:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Game not found"
            )
        
        # Update game
        update_data = game_update.dict(exclude_unset=True)
        if update_data:
            update_data["updated_at"] = datetime.utcnow()
            result = database.games.update_one(
                {"_id": ObjectId(game_id)},
                {"$set": update_data}
            )
            
            if result.modified_count == 0:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="No changes made"
                )
        
        # Return updated game
        updated_game = database.games.find_one({"_id": ObjectId(game_id)})
        updated_game["_id"] = str(updated_game["_id"])
        return updated_game
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to update game: {str(e)}"
        )

@router.post("/{game_id}/join")
async def join_game(game_id: str, player_username: str):
    """Join a game"""
    try:
        # Find player by username
        player_doc = database.players.find_one({"username": player_username})
        if not player_doc:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Player not found"
            )
        
        # Check if game exists
        game_doc = database.games.find_one({"_id": ObjectId(game_id)})
        if not game_doc:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Game not found"
            )
        
        # Check if game is joinable
        if game_doc.get("status") != "waiting":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Game is not accepting new players"
            )
        
        # Check if player is already in the game
        if str(player_doc["_id"]) in game_doc.get("players", []):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Player already in game"
            )
        
        # Add player to game
        result = database.games.update_one(
            {"_id": ObjectId(game_id)},
            {
                "$push": {"players": str(player_doc["_id"])},
                "$set": {"updated_at": datetime.utcnow()}
            }
        )
        
        if result.modified_count == 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to join game"
            )
        
        return {"message": "Successfully joined game", "game_id": game_id}
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to join game: {str(e)}"
        )

@router.post("/{game_id}/start")
async def start_game(game_id: str):
    """Start a game"""
    try:
        # Check if game exists
        game_doc = database.games.find_one({"_id": ObjectId(game_id)})
        if not game_doc:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Game not found"
            )
        
        # Check if game can be started
        if game_doc.get("status") != "waiting":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Game cannot be started"
            )
        
        # Start the game
        result = database.games.update_one(
            {"_id": ObjectId(game_id)},
            {
                "$set": {
                    "status": "active",
                    "started_at": datetime.utcnow(),
                    "updated_at": datetime.utcnow()
                }
            }
        )
        
        if result.modified_count == 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to start game"
            )
        
        return {"message": "Game started successfully", "game_id": game_id}
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to start game: {str(e)}"
        ) 