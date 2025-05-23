import json
from typing import Dict, List
from fastapi import WebSocket
from models.game import WebSocketMessage, Position, GameObject

class GameManager:
    def __init__(self):
        # Active WebSocket connections
        self.connections: Dict[str, WebSocket] = {}
        # Game rooms
        self.rooms: Dict[str, List[str]] = {}
        # Player positions
        self.player_positions: Dict[str, Position] = {}
        
    async def connect(self, player_id: str, websocket: WebSocket):
        """Connect a player to the game"""
        await websocket.accept()
        self.connections[player_id] = websocket
        
        # Send welcome message
        welcome_message = WebSocketMessage(
            type="connected",
            data={"player_id": player_id, "message": "Connected to game server"}
        )
        await self.send_to_player(player_id, welcome_message.dict())
        
    async def disconnect(self, player_id: str):
        """Disconnect a player from the game"""
        if player_id in self.connections:
            del self.connections[player_id]
        
        # Remove from rooms
        for room_id, players in self.rooms.items():
            if player_id in players:
                players.remove(player_id)
                # Notify other players in the room
                await self.broadcast_to_room(room_id, {
                    "type": "player_disconnected",
                    "data": {"player_id": player_id}
                })
        
        # Remove player position
        if player_id in self.player_positions:
            del self.player_positions[player_id]
            
    async def handle_message(self, player_id: str, message: dict):
        """Handle incoming WebSocket message from a player"""
        message_type = message.get("type")
        data = message.get("data", {})
        
        if message_type == "join_room":
            await self.join_room(player_id, data.get("room_id"))
        elif message_type == "leave_room":
            await self.leave_room(player_id, data.get("room_id"))
        elif message_type == "player_move":
            await self.handle_player_move(player_id, data)
        elif message_type == "game_action":
            await self.handle_game_action(player_id, data)
        elif message_type == "chat_message":
            await self.handle_chat_message(player_id, data)
        else:
            print(f"Unknown message type: {message_type}")
            
    async def join_room(self, player_id: str, room_id: str):
        """Add player to a game room"""
        if room_id not in self.rooms:
            self.rooms[room_id] = []
            
        if player_id not in self.rooms[room_id]:
            self.rooms[room_id].append(player_id)
            
        # Notify all players in the room
        await self.broadcast_to_room(room_id, {
            "type": "player_joined",
            "data": {"player_id": player_id, "room_id": room_id}
        })
        
    async def leave_room(self, player_id: str, room_id: str):
        """Remove player from a game room"""
        if room_id in self.rooms and player_id in self.rooms[room_id]:
            self.rooms[room_id].remove(player_id)
            
            # Notify other players in the room
            await self.broadcast_to_room(room_id, {
                "type": "player_left",
                "data": {"player_id": player_id, "room_id": room_id}
            })
            
    async def handle_player_move(self, player_id: str, data: dict):
        """Handle player movement"""
        position_data = data.get("position", {})
        new_position = Position(x=position_data.get("x", 0), y=position_data.get("y", 0))
        
        self.player_positions[player_id] = new_position
        
        # Find which room the player is in and broadcast the movement
        for room_id, players in self.rooms.items():
            if player_id in players:
                await self.broadcast_to_room(room_id, {
                    "type": "player_moved",
                    "data": {
                        "player_id": player_id,
                        "position": new_position.dict()
                    }
                }, exclude=[player_id])
                
    async def handle_game_action(self, player_id: str, data: dict):
        """Handle game-specific actions"""
        action_type = data.get("action")
        
        # Find which room the player is in
        for room_id, players in self.rooms.items():
            if player_id in players:
                await self.broadcast_to_room(room_id, {
                    "type": "game_action",
                    "data": {
                        "player_id": player_id,
                        "action": action_type,
                        "details": data
                    }
                })
                
    async def handle_chat_message(self, player_id: str, data: dict):
        """Handle chat messages"""
        message = data.get("message", "")
        room_id = data.get("room_id")
        
        if room_id and room_id in self.rooms and player_id in self.rooms[room_id]:
            await self.broadcast_to_room(room_id, {
                "type": "chat_message",
                "data": {
                    "player_id": player_id,
                    "message": message,
                    "timestamp": data.get("timestamp")
                }
            })
            
    async def send_to_player(self, player_id: str, message: dict):
        """Send message to a specific player"""
        if player_id in self.connections:
            try:
                await self.connections[player_id].send_text(json.dumps(message))
            except Exception as e:
                print(f"Error sending message to player {player_id}: {e}")
                await self.disconnect(player_id)
                
    async def broadcast_to_room(self, room_id: str, message: dict, exclude: List[str] = None):
        """Broadcast message to all players in a room"""
        if room_id not in self.rooms:
            return
            
        exclude = exclude or []
        
        for player_id in self.rooms[room_id]:
            if player_id not in exclude:
                await self.send_to_player(player_id, message)
                
    async def broadcast_to_all(self, message: dict):
        """Broadcast message to all connected players"""
        for player_id in self.connections:
            await self.send_to_player(player_id, message) 