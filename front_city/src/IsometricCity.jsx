import React, { useRef, useState } from "react";
import { Stage, Container, Graphics } from "@pixi/react";

const TILE_WIDTH = 64;
const TILE_HEIGHT = 32;
const MAP_SIZE = 10;

const BUILDING_TYPES = [
  { type: "blue", color: 0x66ccff, label: "Синий", css: "#66ccff" },
  { type: "green", color: 0x3ddc97, label: "Зелёный", css: "#3ddc97" },
  { type: "red", color: 0xff5555, label: "Красный", css: "#ff5555" },
];

function toIso(x, y) {
  return {
    x: (x - y) * (TILE_WIDTH / 2),
    y: (x + y) * (TILE_HEIGHT / 2),
  };
}

const Building = ({ x, y, color }) => {
  const pos = toIso(x, y);
  return (
    <Graphics
      draw={(g) => {
        g.clear();
        g.beginFill(color);
        g.drawRect(-TILE_WIDTH / 2, -TILE_HEIGHT, TILE_WIDTH, TILE_HEIGHT);
        g.endFill();
      }}
      x={pos.x}
      y={pos.y}
    />
  );
};

export default function IsometricCity() {
  const [offset, setOffset] = useState({ x: 400, y: 100 });
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const offsetStart = useRef({ x: 0, y: 0 });

  const [placed, setPlaced] = useState([
    { x: 4, y: 4, type: "blue", color: 0x66ccff },
  ]);
  const [dragGhost, setDragGhost] = useState(null);

  // DnD для зданий (всё через dragGhost.type)
  function handlePanelMouseDown(e, type) {
    e.preventDefault();
    setDragGhost({ x: e.clientX, y: e.clientY, type });
    window.addEventListener("mousemove", handleDragMouseMove);
    window.addEventListener("mouseup", handleDragMouseUp, { once: true });
  }
  function handleDragMouseMove(e) {
    setDragGhost((g) => g ? { ...g, x: e.clientX, y: e.clientY } : null);
  }
  function handleDragMouseUp(e) {
    setDragGhost((g) => {
      if (!g) {
        cleanupListeners();
        return null;
      }
      const mapDiv = document.getElementById("iso-map-div");
      const rect = mapDiv.getBoundingClientRect();
      const isOverMap =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;
      if (isOverMap) {
        const stageX = e.clientX - rect.left - offset.x;
        const stageY = e.clientY - rect.top - offset.y;
        const x = Math.floor((stageY / (TILE_HEIGHT / 2) + stageX / (TILE_WIDTH / 2)) / 2);
        const y = Math.floor((stageY / (TILE_HEIGHT / 2) - stageX / (TILE_WIDTH / 2)) / 2);
        if (x >= 0 && y >= 0 && x < MAP_SIZE && y < MAP_SIZE) {
          const buildingDef = BUILDING_TYPES.find((b) => b.type === g.type);
          setPlaced((blds) => [...blds, { x, y, ...buildingDef }]);
        }
      }
      cleanupListeners();
      return null;
    });
  }
  function cleanupListeners() {
    window.removeEventListener("mousemove", handleDragMouseMove);
    window.removeEventListener("mouseup", handleDragMouseUp, { once: true });
  }

  // Перетаскивание карты
  function onPointerDown(e) {
    setDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY };
    offsetStart.current = { ...offset };
  }
  function onPointerMove(e) {
    if (!dragging) return;
    setOffset({
      x: offsetStart.current.x + (e.clientX - dragStart.current.x),
      y: offsetStart.current.y + (e.clientY - dragStart.current.y),
    });
  }
  function onPointerUp() {
    setDragging(false);
  }

  React.useEffect(() => {
    return () => cleanupListeners();
    // eslint-disable-next-line
  }, []);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: "#222",
        overflow: "hidden",
        display: "flex",
        flexDirection: "row",
      }}
    >
      {/* Левая панель с кубиками */}
      <div
        style={{
          width: 110,
          background: "#232323",
          borderRadius: 16,
          margin: 24,
          padding: 12,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 32,
          boxShadow: "0 2px 8px #0004",
          zIndex: 10,
        }}
      >
        <div style={{ color: "#fff", marginBottom: 16, fontSize: 14, textAlign: "center" }}>
          Здания
        </div>
        {BUILDING_TYPES.map((b) => (
          <div
            key={b.type}
            onMouseDown={(e) => handlePanelMouseDown(e, b.type)}
            style={{
              width: 48,
              height: 48,
              background: "#222",
              border: `3px solid ${b.css}`,
              borderRadius: 8,
              boxShadow: `0 0 12px ${b.css}88`,
              marginBottom: 8,
              cursor: "grab",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              userSelect: "none",
              transition: "opacity 0.15s",
            }}
            title={`Перетащите: ${b.label}`}
          >
            <div
              style={{
                width: 32,
                height: 32,
                background: b.css,
                borderRadius: 5,
              }}
            ></div>
            <div style={{ fontSize: 12, color: "#ccc", marginTop: 6 }}>{b.label}</div>
          </div>
        ))}
        <div
          style={{
            marginTop: 12,
            color: "#66ccff",
            fontWeight: "bold",
            fontSize: 13,
            textAlign: "center",
            minHeight: 30,
            transition: "color 0.2s",
            opacity: dragGhost ? 1 : 0.3,
          }}
        >
          {dragGhost
            ? "Отпустите на карте"
            : "Перетащите здание"}
        </div>
      </div>

      {/* Игровое поле */}
      <div id="iso-map-div" style={{ flex: 1, position: "relative" }}>
        <Stage
          width={window.innerWidth}
          height={window.innerHeight}
          options={{ backgroundAlpha: 0 }}
        >
          <Container
            x={offset.x}
            y={offset.y}
            interactive={true}
            pointerdown={onPointerDown}
            pointerup={onPointerUp}
            pointerupoutside={onPointerUp}
            pointermove={onPointerMove}
            mousedown={onPointerDown}
          >
            {/* Сетка */}
            {[...Array(MAP_SIZE)].map((_, x) =>
              [...Array(MAP_SIZE)].map((_, y) => {
                const pos = toIso(x, y);
                return (
                  <Graphics
                    key={`${x}-${y}`}
                    draw={(g) => {
                      g.clear();
                      g.lineStyle(1, 0x555555, 0.6);
                      g.beginFill(0x333333, 0.1);
                      g.moveTo(0, 0);
                      g.lineTo(TILE_WIDTH / 2, TILE_HEIGHT / 2);
                      g.lineTo(0, TILE_HEIGHT);
                      g.lineTo(-TILE_WIDTH / 2, TILE_HEIGHT / 2);
                      g.lineTo(0, 0);
                      g.endFill();
                    }}
                    x={pos.x}
                    y={pos.y}
                  />
                );
              })
            )}
            {/* Здания */}
            {placed.map((b, i) => (
              <Building key={i} x={b.x} y={b.y} color={b.color} />
            ))}
          </Container>
        </Stage>
        {/* Призрак блока */}
        {dragGhost && (
          <div
            style={{
              pointerEvents: "none",
              position: "fixed",
              left: dragGhost.x - 24,
              top: dragGhost.y - 24,
              width: 48,
              height: 48,
              opacity: 0.8,
              borderRadius: 8,
              boxShadow: `0 0 12px #000a`,
              background: BUILDING_TYPES.find(b=>b.type===dragGhost.type).css,
              border: "2px solid #fff",
              zIndex: 999,
            }}
          ></div>
        )}
      </div>
    </div>
  );
}
