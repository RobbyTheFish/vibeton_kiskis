// MongoDB initialization script
db = db.getSiblingDB('vibeton_game');

// Create collections with indexes
db.createCollection('players');
db.createCollection('games');
db.createCollection('game_sessions');

// Create indexes for better performance
db.players.createIndex({ "username": 1 }, { unique: true });
db.players.createIndex({ "score": -1 });
db.players.createIndex({ "created_at": 1 });

db.games.createIndex({ "status": 1 });
db.games.createIndex({ "players": 1 });
db.games.createIndex({ "created_at": -1 });
db.games.createIndex({ "game_type": 1 });

db.game_sessions.createIndex({ "game_id": 1 });
db.game_sessions.createIndex({ "player_id": 1 });
db.game_sessions.createIndex({ "created_at": -1 });

print("Database initialized successfully!"); 