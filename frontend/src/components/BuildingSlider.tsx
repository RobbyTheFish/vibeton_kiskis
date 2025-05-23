import React, { useState, useEffect } from "react";
import backgroundImage from '../img/background.png';
import platformSprite from '../img/sprites/platform.png';
import { SimpleGameEngine, GameState } from '../game/SimpleGameEngine';
import { BUILDINGS } from '../game/buildings';

// Создаем единственный экземпляр игрового движка
const gameEngine = new SimpleGameEngine(BUILDINGS);

export default function BuildingSlider() {
  const [gameState, setGameState] = useState<GameState>(gameEngine.getState());

  useEffect(() => {
    // Подписываемся на изменения состояния игры
    const unsubscribe = gameEngine.subscribe(setGameState);
    
    return () => {
      unsubscribe();
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
          width: "700px",
          height: "500px",
        }}
      >
        {/* Платформа */}
        <img
          src={platformSprite}
          alt="Platform"
          style={{
            position: "absolute",
            bottom: "40px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "350px",
            height: "auto",
            zIndex: 1,
          }}
        />

        {/* Здание с fade-анимацией */}
        <img
          key={gameState.currentField} // Ключ для пересоздания элемента при смене
          src={currentBuilding.sprite}
          alt={currentBuilding.name}
          style={{
            position: "absolute",
            bottom: "120px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "250px",
            height: "auto",
            zIndex: 2,
            animation: gameState.isAnimating 
              ? 'fadeIn 0.4s ease-in-out' 
              : 'none',
            opacity: gameState.isAnimating ? 0 : 1,
          }}
        />
      </div>

      {/* CSS анимации */}
      <style>
        {`
          @keyframes fadeIn {
            0% { opacity: 0; transform: translateX(-50%) scale(0.8); }
            100% { opacity: 1; transform: translateX(-50%) scale(1); }
          }
        `}
      </style>

      {/* Левая стрелка */}
      <button
        onClick={() => gameEngine.prevField()}
        disabled={gameState.isAnimating}
        style={{
          position: "absolute",
          left: "80px",
          top: "50%",
          transform: "translateY(-50%)",
          background: "rgba(255, 255, 255, 0.8)",
          border: "3px solid rgba(233, 75, 60, 0.9)",
          borderRadius: "50%",
          width: "70px",
          height: "70px",
          cursor: gameState.isAnimating ? "not-allowed" : "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "28px",
          color: "var(--primary-color)",
          zIndex: 10,
          opacity: gameState.isAnimating ? 0.5 : 1,
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
          right: "80px",
          top: "50%",
          transform: "translateY(-50%)",
          background: "rgba(255, 255, 255, 0.8)",
          border: "3px solid rgba(233, 75, 60, 0.9)",
          borderRadius: "50%",
          width: "70px",
          height: "70px",
          cursor: gameState.isAnimating ? "not-allowed" : "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "28px",
          color: "var(--primary-color)",
          zIndex: 10,
          opacity: gameState.isAnimating ? 0.5 : 1,
        }}
      >
        →
      </button>

      {/* Информационная панель о здании */}
      <div
        style={{
          position: "absolute",
          bottom: "50px",
          left: "50%",
          transform: "translateX(-50%)",
          background: "rgba(255, 255, 255, 0.95)",
          padding: "20px 32px",
          borderRadius: "24px",
          border: "3px solid rgba(233, 75, 60, 0.4)",
          textAlign: "center",
          zIndex: 10,
          minWidth: "300px",
        }}
      >
        <div style={{
          fontSize: "22px",
          fontWeight: "bold",
          color: "var(--primary-color)",
          marginBottom: "8px"
        }}>
          {currentBuilding.name}
        </div>
        <div style={{
          fontSize: "16px",
          color: "#666",
          marginBottom: "8px"
        }}>
          {gameState.currentField + 1} из {gameEngine.getTotalFields()}
        </div>
        {currentBuilding.description && (
          <div style={{
            fontSize: "14px",
            color: "#888",
            fontStyle: "italic",
            lineHeight: "1.4",
            maxWidth: "250px",
            margin: "0 auto"
          }}>
            {currentBuilding.description}
          </div>
        )}
      </div>

      {/* Индикаторы прогресса */}
      <div
        style={{
          position: "absolute",
          top: "40px",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: "12px",
          zIndex: 10,
        }}
      >
        {BUILDINGS.map((_, index) => (
          <div
            key={index}
            style={{
              width: "16px",
              height: "16px",
              borderRadius: "50%",
              background: index === gameState.currentField 
                ? "var(--primary-color)" 
                : "rgba(255, 255, 255, 0.6)",
              border: "3px solid rgba(255, 255, 255, 0.9)",
              cursor: "pointer",
            }}
            onClick={() => gameEngine.goToField(index)}
          />
        ))}
      </div>

      {/* Кнопка экстренного сброса */}
      {gameState.isAnimating && (
        <button
          onClick={() => gameEngine.resetAnimation()}
          style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            background: "rgba(255, 0, 0, 0.9)",
            color: "white",
            border: "2px solid white",
            borderRadius: "8px",
            padding: "8px 16px",
            fontSize: "12px",
            cursor: "pointer",
            zIndex: 20,
          }}
        >
          🔄 Сбросить
        </button>
      )}
    </div>
  );
} 