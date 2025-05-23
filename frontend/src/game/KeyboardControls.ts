import { SimpleGameEngine } from './SimpleGameEngine';

export class KeyboardControls {
  private gameEngine: SimpleGameEngine;
  private keyHandler: (event: KeyboardEvent) => void;

  constructor(gameEngine: SimpleGameEngine) {
    this.gameEngine = gameEngine;
    this.keyHandler = this.handleKeyPress.bind(this);
  }

  // Обработчик нажатий клавиш
  private handleKeyPress(event: KeyboardEvent) {
    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        this.gameEngine.prevField();
        break;
      case 'ArrowRight':
        event.preventDefault();
        this.gameEngine.nextField();
        break;
      case 'Home':
        event.preventDefault();
        this.gameEngine.goToField(0);
        break;
      case 'End':
        event.preventDefault();
        this.gameEngine.goToField(this.gameEngine.getTotalFields() - 1);
        break;
      case '1':
      case '2':
      case '3':
      case '4':
        event.preventDefault();
        const fieldIndex = parseInt(event.key) - 1;
        if (fieldIndex < this.gameEngine.getTotalFields()) {
          this.gameEngine.goToField(fieldIndex);
        }
        break;
    }
  }

  // Включить обработку клавиатуры
  enable() {
    document.addEventListener('keydown', this.keyHandler);
  }

  // Отключить обработку клавиатуры
  disable() {
    document.removeEventListener('keydown', this.keyHandler);
  }
} 