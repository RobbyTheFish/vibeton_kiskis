# Game Engine - Игровой движок

Эта папка содержит всю игровую логику для Vibeton Game.

## Файлы

### `SimpleGameEngine.ts`
Основной движок игры, управляет состоянием и переключением между полями:
- **GameState**: Интерфейс состояния игры
- **SimpleGameEngine**: Класс управления игрой с методами:
  - `nextField()` - переход к следующему полю
  - `prevField()` - переход к предыдущему полю
  - `goToField(index)` - переход к конкретному полю
  - `subscribe(listener)` - подписка на изменения состояния

### `buildings.ts`
Конфигурация всех зданий в игре:
- **BUILDINGS**: Массив всех доступных зданий
- **Building**: Интерфейс здания с id, name, sprite, description
- Утилиты: `getBuildingById()`, `getRandomBuilding()`

### `KeyboardControls.ts`
Система управления клавиатурой:
- **Стрелки ← →**: переключение между полями
- **Цифры 1-4**: быстрый переход к полю
- **Home/End**: переход к первому/последнему полю

## Здания

1. **Жилой дом** (`apartment.png`) - Комфортное место для проживания
2. **Больница** (`hospital.png`) - Медицинский центр
3. **Лагерь** (`camphouse.png`) - Место отдыха на природе  
4. **Автосервис** (`autoservice.png`) - Ремонт автомобилей

## Использование

```typescript
import { SimpleGameEngine } from './game/SimpleGameEngine';
import { BUILDINGS } from './game/buildings';

// Создание движка
const gameEngine = new SimpleGameEngine(BUILDINGS);

// Подписка на изменения
const unsubscribe = gameEngine.subscribe((state) => {
  console.log('Текущее поле:', state.currentField);
});

// Управление
gameEngine.nextField();
gameEngine.prevField();
gameEngine.goToField(2);
```

## Архитектура

Игра построена по принципу **Observer Pattern**:
- GameEngine хранит состояние игры
- Компоненты подписываются на изменения через `subscribe()`
- При изменении состояния все подписчики получают обновления
- Анимации синхронизируются через состояние `isAnimating`

## Расширение

Для добавления новых зданий:
1. Добавьте спрайт в `frontend/src/img/sprites/`
2. Обновите массив `BUILDINGS` в `buildings.ts`
3. Здания автоматически появятся в игре 