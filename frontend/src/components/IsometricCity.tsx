import React, { useState, useEffect } from "react";
import backgroundImage from '../img/background.png';
import platformSprite from '../img/sprites/platform.png';
import { SimpleGameEngine, GameState } from '../game/SimpleGameEngine';
import { BUILDINGS } from '../game/buildings';
import { KeyboardControls } from '../game/KeyboardControls';

// Создаем единственный экземпляр игрового движка
const gameEngine = new SimpleGameEngine(BUILDINGS);
const keyboardControls = new KeyboardControls(gameEngine);

export default function IsometricCity() {
  const [gameState, setGameState] = useState<GameState>(gameEngine.getState());

  useEffect(() => {
    // Подписываемся на изменения состояния игры
    const unsubscribe = gameEngine.subscribe(setGameState);
    
    // Включаем управление клавиатурой
    keyboardControls.enable();
    
    return () => {
      unsubscribe();
      keyboardControls.disable();
    };
  }, []);

  const currentBuilding = gameEngine.getCurrentBuilding();

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Игровое поле */}
      <div
        style={{
          position: "relative",
          width: "600px",
          height: "400px",
          transform: gameState.isAnimating ? 'translateX(-100px)' : 'translateX(0)',
          transition: 'transform 0.3s ease-out',
          opacity: gameState.isAnimating ? 0.7 : 1,
        }}
      >
        {/* Платформа */}
        <img
          src={platformSprite}
          alt="Platform"
          style={{
            position: "absolute",
            bottom: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "300px",
            height: "auto",
            zIndex: 1,
          }}
        />

        {/* Здание */}
        <img
          src={currentBuilding.sprite}
          alt={currentBuilding.name}
          style={{
            position: "absolute",
            bottom: "80px", // Поднимаем над платформой
            left: "50%",
            width: "200px",
            height: "auto",
            zIndex: 2,
            transition: 'all 0.3s ease-out',
            transform: gameState.isAnimating 
              ? 'translateX(-150%) scale(0.8)' 
              : 'translateX(-50%) scale(1)',
          }}
        />
      </div>

      {/* Левая стрелка */}
      <button
        onClick={() => gameEngine.prevField()}
        disabled={gameState.isAnimating}
        style={{
          position: "absolute",
          left: "50px",
          top: "50%",
          transform: "translateY(-50%)",
          background: "rgba(255, 255, 255, 0.6)",
          border: "2px solid rgba(233, 75, 60, 0.8)",
          borderRadius: "50%",
          width: "60px",
          height: "60px",
          cursor: gameState.isAnimating ? "not-allowed" : "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "24px",
          color: "var(--primary-color)",
          transition: "all 0.3s ease",
          zIndex: 10,
          opacity: gameState.isAnimating ? 0.4 : 0.8,
          backdropFilter: "blur(10px)",
        }}
        onMouseEnter={(e) => {
          if (!gameState.isAnimating) {
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.9)";
            e.currentTarget.style.opacity = "1";
            e.currentTarget.style.transform = "translateY(-50%) scale(1.1)";
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(255, 255, 255, 0.6)";
          e.currentTarget.style.opacity = gameState.isAnimating ? "0.4" : "0.8";
          e.currentTarget.style.transform = "translateY(-50%) scale(1)";
        }}
      >
        ←
      </button>

      {/* Правая стрелка */}
      <button
        onClick={() => gameEngine.nextField()}
        disabled={gameState.isAnimating}
        style={{
          position: "absolute",
          right: "50px",
          top: "50%",
          transform: "translateY(-50%)",
          background: "rgba(255, 255, 255, 0.6)",
          border: "2px solid rgba(233, 75, 60, 0.8)",
          borderRadius: "50%",
          width: "60px",
          height: "60px",
          cursor: gameState.isAnimating ? "not-allowed" : "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "24px",
          color: "var(--primary-color)",
          transition: "all 0.3s ease",
          zIndex: 10,
          opacity: gameState.isAnimating ? 0.4 : 0.8,
          backdropFilter: "blur(10px)",
        }}
        onMouseEnter={(e) => {
          if (!gameState.isAnimating) {
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.9)";
            e.currentTarget.style.opacity = "1";
            e.currentTarget.style.transform = "translateY(-50%) scale(1.1)";
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(255, 255, 255, 0.6)";
          e.currentTarget.style.opacity = gameState.isAnimating ? "0.4" : "0.8";
          e.currentTarget.style.transform = "translateY(-50%) scale(1)";
        }}
      >
        →
      </button>

      {/* Информация о здании */}
      <div
        style={{
          position: "absolute",
          bottom: "30px",
          left: "50%",
          transform: "translateX(-50%)",
          background: "rgba(255, 255, 255, 0.9)",
          padding: "12px 24px",
          borderRadius: "20px",
          border: "2px solid rgba(233, 75, 60, 0.3)",
          backdropFilter: "blur(10px)",
          textAlign: "center",
          zIndex: 10,
          transition: 'all 0.3s ease',
          opacity: gameState.isAnimating ? 0.6 : 1,
        }}
      >
        <div style={{
          fontSize: "18px",
          fontWeight: "bold",
          color: "var(--primary-color)",
          marginBottom: "4px"
        }}>
          {currentBuilding.name}
        </div>
        <div style={{
          fontSize: "14px",
          color: "#666",
          marginBottom: "4px"
        }}>
          {gameState.currentField + 1} из {gameEngine.getTotalFields()}
        </div>
        {currentBuilding.description && (
          <div style={{
            fontSize: "12px",
            color: "#888",
            fontStyle: "italic"
          }}>
            {currentBuilding.description}
          </div>
        )}
      </div>

      {/* Индикаторы */}
      <div
        style={{
          position: "absolute",
          top: "30px",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: "8px",
          zIndex: 10,
        }}
      >
        {BUILDINGS.map((_, index) => (
          <div
            key={index}
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              background: index === gameState.currentField 
                ? "var(--primary-color)" 
                : "rgba(255, 255, 255, 0.5)",
              border: "2px solid rgba(255, 255, 255, 0.8)",
              transition: "all 0.3s ease",
              cursor: "pointer",
            }}
            onClick={() => gameEngine.goToField(index)}
          />
        ))}
      </div>

      {/* Подсказка по управлению */}
      <div
        style={{
          position: "absolute",
          top: "60px",
          left: "50%",
          transform: "translateX(-50%)",
          background: "rgba(0, 0, 0, 0.7)",
          color: "white",
          padding: "8px 16px",
          borderRadius: "12px",
          fontSize: "12px",
          textAlign: "center",
          zIndex: 10,
          opacity: 0.8,
        }}
      >
        Используйте ← → стрелки или цифры 1-4 для переключения
      </div>
    </div>
  );
} 