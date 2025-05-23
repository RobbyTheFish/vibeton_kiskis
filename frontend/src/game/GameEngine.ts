import * as PIXI from 'pixi.js'
import { Player } from './Player'
import { WebSocketManager } from './WebSocketManager'

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

// Игровой движок
export class GameEngine {
  private app: PIXI.Application
  private container: HTMLElement
  private player: Player | null = null
  private wsManager: WebSocketManager | null = null
  private gameObjects: Map<string, PIXI.DisplayObject> = new Map()
  private keys: Set<string> = new Set()
  private state: GameState
  private stateListeners: ((state: GameState) => void)[] = []

  constructor(container: HTMLElement, buildings: Building[]) {
    this.container = container
    this.app = new PIXI.Application({
      width: 800,
      height: 600,
      backgroundColor: 0x1099bb,
      antialias: true,
    })
    this.state = {
      currentField: 0,
      fields: buildings.map((building, index) => ({
        id: index,
        building,
      })),
      isAnimating: false,
    }
  }

  async init(): Promise<void> {
    // Add the canvas to the container
    this.container.appendChild(this.app.view as HTMLCanvasElement)

    // Initialize WebSocket connection
    this.wsManager = new WebSocketManager()
    await this.wsManager.connect()

    // Create player
    this.player = new Player(400, 300)
    this.app.stage.addChild(this.player.sprite)

    // Setup event listeners
    this.setupEventListeners()

    // Start game loop
    this.app.ticker.add(this.gameLoop.bind(this))

    // Create some sample game objects
    this.createSampleObjects()
  }

  private setupEventListeners(): void {
    // Keyboard events
    window.addEventListener('keydown', (e) => {
      this.keys.add(e.code)
    })

    window.addEventListener('keyup', (e) => {
      this.keys.delete(e.code)
    })

    // Mouse events
    this.app.stage.interactive = true
    this.app.stage.on('pointerdown', (event) => {
      const position = event.data.global
      console.log('Clicked at:', position.x, position.y)
    })
  }

  private gameLoop(): void {
    if (!this.player) return

    // Handle player movement
    let dx = 0
    let dy = 0
    const speed = 5

    if (this.keys.has('KeyW') || this.keys.has('ArrowUp')) dy -= speed
    if (this.keys.has('KeyS') || this.keys.has('ArrowDown')) dy += speed
    if (this.keys.has('KeyA') || this.keys.has('ArrowLeft')) dx -= speed
    if (this.keys.has('KeyD') || this.keys.has('ArrowRight')) dx += speed

    if (dx !== 0 || dy !== 0) {
      this.player.move(dx, dy)
      
      // Send movement to server
      if (this.wsManager) {
        this.wsManager.sendMessage({
          type: 'player_move',
          data: {
            position: {
              x: this.player.sprite.x,
              y: this.player.sprite.y
            }
          }
        })
      }
    }

    // Handle actions
    if (this.keys.has('Space')) {
      this.handleAction()
    }
  }

  private handleAction(): void {
    console.log('Action performed!')
    // Add action logic here
  }

  private createSampleObjects(): void {
    // Create some sample objects
    for (let i = 0; i < 5; i++) {
      const circle = new PIXI.Graphics()
      circle.beginFill(0xff0000)
      circle.drawCircle(0, 0, 20)
      circle.endFill()
      circle.x = Math.random() * 700 + 50
      circle.y = Math.random() * 500 + 50
      circle.interactive = true
      circle.on('pointerdown', () => {
        console.log('Object clicked!')
        circle.tint = Math.random() * 0xffffff
      })
      
      this.app.stage.addChild(circle)
      this.gameObjects.set(`object_${i}`, circle)
    }
  }

  public addGameObject(id: string, object: PIXI.DisplayObject): void {
    this.gameObjects.set(id, object)
    this.app.stage.addChild(object)
  }

  public removeGameObject(id: string): void {
    const object = this.gameObjects.get(id)
    if (object) {
      this.app.stage.removeChild(object)
      this.gameObjects.delete(id)
    }
  }

  public destroy(): void {
    // Clean up event listeners
    window.removeEventListener('keydown', () => {})
    window.removeEventListener('keyup', () => {})

    // Disconnect WebSocket
    if (this.wsManager) {
      this.wsManager.disconnect()
    }

    // Destroy PIXI app
    this.app.destroy(true, true)
  }

  // Подписка на изменения состояния
  subscribe(listener: (state: GameState) => void) {
    this.stateListeners.push(listener)
    return () => {
      this.stateListeners = this.stateListeners.filter(l => l !== listener)
    }
  }

  // Уведомление слушателей об изменении состояния
  private notifyStateChange() {
    this.stateListeners.forEach(listener => listener(this.state))
  }

  // Получить текущее состояние
  getState(): GameState {
    return { ...this.state }
  }

  // Переход к следующему полю
  nextField(): Promise<void> {
    if (this.state.isAnimating) return Promise.resolve()

    return new Promise((resolve) => {
      this.state.isAnimating = true
      this.notifyStateChange()

      setTimeout(() => {
        this.state.currentField = (this.state.currentField + 1) % this.state.fields.length
        this.state.isAnimating = false
        this.notifyStateChange()
        resolve()
      }, 300)
    })
  }

  // Переход к предыдущему полю
  prevField(): Promise<void> {
    if (this.state.isAnimating) return Promise.resolve()

    return new Promise((resolve) => {
      this.state.isAnimating = true
      this.notifyStateChange()

      setTimeout(() => {
        this.state.currentField = (this.state.currentField - 1 + this.state.fields.length) % this.state.fields.length
        this.state.isAnimating = false
        this.notifyStateChange()
        resolve()
      }, 300)
    })
  }

  // Переход к конкретному полю
  goToField(fieldIndex: number): Promise<void> {
    if (this.state.isAnimating || fieldIndex === this.state.currentField) {
      return Promise.resolve()
    }

    return new Promise((resolve) => {
      this.state.isAnimating = true
      this.notifyStateChange()

      setTimeout(() => {
        this.state.currentField = fieldIndex
        this.state.isAnimating = false
        this.notifyStateChange()
        resolve()
      }, 300)
    })
  }

  // Получить текущее здание
  getCurrentBuilding(): Building {
    return this.state.fields[this.state.currentField].building
  }

  // Получить общее количество полей
  getTotalFields(): number {
    return this.state.fields.length
  }
} 