from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum
from bson import ObjectId

class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid objectid")
        return ObjectId(v)

    @classmethod
    def __get_pydantic_json_schema__(cls, field_schema):
        field_schema.update(type="string")

class GameType(str, Enum):
    SINGLE_PLAYER = "single_player"
    MULTIPLAYER = "multiplayer"
    TOURNAMENT = "tournament"

class GameStatus(str, Enum):
    WAITING = "waiting"
    ACTIVE = "active"
    PAUSED = "paused"
    FINISHED = "finished"

class Position(BaseModel):
    x: float
    y: float

class Player(BaseModel):
    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
        json_schema_extra={
            "example": {
                "username": "player1",
                "score": 0,
                "level": 1
            }
        }
    )
    
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    username: str
    score: int = 0
    level: int = 1
    experience: int = 0
    position: Optional[Position] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    is_active: bool = True

class GameObject(BaseModel):
    id: str
    type: str
    position: Position
    properties: Dict[str, Any] = {}

class GameState(BaseModel):
    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True
    )
    
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    game_type: GameType
    status: GameStatus
    players: List[str] = []  # Player IDs
    game_objects: List[GameObject] = []
    current_level: int = 1
    score: int = 0
    settings: Dict[str, Any] = {}
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    started_at: Optional[datetime] = None
    finished_at: Optional[datetime] = None

class PlayerCreate(BaseModel):
    username: str

class PlayerUpdate(BaseModel):
    score: Optional[int] = None
    level: Optional[int] = None
    experience: Optional[int] = None
    position: Optional[Position] = None

class GameCreate(BaseModel):
    game_type: GameType
    settings: Dict[str, Any] = {}

class GameUpdate(BaseModel):
    status: Optional[GameStatus] = None
    score: Optional[int] = None
    current_level: Optional[int] = None
    game_objects: Optional[List[GameObject]] = None

class WebSocketMessage(BaseModel):
    type: str
    data: Dict[str, Any] = {} 