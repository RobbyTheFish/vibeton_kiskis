import os
from pymongo import MongoClient
from pymongo.database import Database
from pymongo.collection import Collection

class DatabaseManager:
    def __init__(self):
        self.client: MongoClient = None
        self.db: Database = None
        
    async def connect(self):
        """Connect to MongoDB"""
        mongodb_url = os.getenv("MONGODB_URL", "mongodb://admin:password123@localhost:27017/vibeton_game?authSource=admin")
        self.client = MongoClient(mongodb_url)
        self.db = self.client.get_default_database()
        
        # Test connection
        await self.ping()
        
    async def disconnect(self):
        """Disconnect from MongoDB"""
        if self.client:
            self.client.close()
            
    async def ping(self):
        """Test database connection"""
        self.client.admin.command('ping')
        
    def get_collection(self, name: str) -> Collection:
        """Get a collection by name"""
        return self.db[name]
    
    @property
    def players(self) -> Collection:
        return self.get_collection("players")
    
    @property
    def games(self) -> Collection:
        return self.get_collection("games")
    
    @property
    def game_sessions(self) -> Collection:
        return self.get_collection("game_sessions")

# Global database instance
database = DatabaseManager() 