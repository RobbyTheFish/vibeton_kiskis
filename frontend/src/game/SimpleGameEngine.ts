// Интерфейсы игры
export interface Building {
  id: string;
  name: string;
  sprite: string;
  description?: string;
}

export interface GameField {
  id: number;
  building: Building;
}

export interface GameState {
  currentField: number;
  fields: GameField[];
  isAnimating: boolean;
}

// Простой игровой движок для слайдера зданий
export class SimpleGameEngine {
  private state: GameState;
  private stateListeners: ((state: GameState) => void)[] = [];
  private animationTimeout: number | null = null;

  constructor(buildings: Building[]) {
    this.state = {
      currentField: 0,
      fields: buildings.map((building, index) => ({
        id: index,
        building,
      })),
      isAnimating: false,
    };
    console.log('GameEngine initialized with', buildings.length, 'buildings');
  }

  // Подписка на изменения состояния
  subscribe(listener: (state: GameState) => void) {
    this.stateListeners.push(listener);
    return () => {
      this.stateListeners = this.stateListeners.filter(l => l !== listener);
    };
  }

  // Уведомление слушателей об изменении состояния
  private notifyStateChange() {
    this.stateListeners.forEach(listener => listener(this.state));
  }

  // Очистка таймера анимации
  private clearAnimationTimeout() {
    if (this.animationTimeout !== null) {
      clearTimeout(this.animationTimeout);
      this.animationTimeout = null;
    }
  }

  // Получить текущее состояние
  getState(): GameState {
    return { ...this.state };
  }

  // Принудительный сброс анимации
  resetAnimation() {
    console.log('Resetting animation');
    this.clearAnimationTimeout();
    this.state.isAnimating = false;
    this.notifyStateChange();
  }

  // Универсальный метод для смены поля с fade анимацией
  private changeField(newFieldIndex: number): Promise<void> {
    if (this.state.isAnimating || newFieldIndex === this.state.currentField) {
      console.log('Skipping field change to:', newFieldIndex, '(animating:', this.state.isAnimating, ', current:', this.state.currentField, ')');
      return Promise.resolve();
    }

    console.log('Starting field change animation to:', newFieldIndex);
    return new Promise((resolve) => {
      // Сначала запускаем анимацию
      this.state.isAnimating = true;
      this.notifyStateChange();

      // Небольшая задержка, затем меняем поле и анимация завершится
      this.animationTimeout = window.setTimeout(() => {
        this.state.currentField = newFieldIndex;
        this.notifyStateChange();
        
        // Еще небольшая задержка для завершения анимации
        this.animationTimeout = window.setTimeout(() => {
          this.state.isAnimating = false;
          this.animationTimeout = null;
          console.log('Field change completed, now at:', this.state.currentField);
          this.notifyStateChange();
          resolve();
        }, 50);
      }, 50);
    });
  }

  // Переход к следующему полю
  nextField(): Promise<void> {
    const nextIndex = (this.state.currentField + 1) % this.state.fields.length;
    return this.changeField(nextIndex);
  }

  // Переход к предыдущему полю
  prevField(): Promise<void> {
    const prevIndex = (this.state.currentField - 1 + this.state.fields.length) % this.state.fields.length;
    return this.changeField(prevIndex);
  }

  // Переход к конкретному полю
  goToField(fieldIndex: number): Promise<void> {
    return this.changeField(fieldIndex);
  }

  // Получить текущее здание
  getCurrentBuilding(): Building {
    return this.state.fields[this.state.currentField].building;
  }

  // Получить общее количество полей
  getTotalFields(): number {
    return this.state.fields.length;
  }

  // Очистка ресурсов
  destroy() {
    console.log('Destroying GameEngine');
    this.clearAnimationTimeout();
    this.stateListeners = [];
  }
} 