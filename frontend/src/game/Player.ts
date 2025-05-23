import * as PIXI from 'pixi.js'

export class Player {
  public sprite: PIXI.Graphics
  private speed: number = 5

  constructor(x: number, y: number) {
    this.sprite = new PIXI.Graphics()
    this.createSprite()
    this.sprite.x = x
    this.sprite.y = y
  }

  private createSprite(): void {
    // Create a simple player sprite (blue circle)
    this.sprite.beginFill(0x0066ff)
    this.sprite.drawCircle(0, 0, 25)
    this.sprite.endFill()
    
    // Add a white border
    this.sprite.lineStyle(3, 0xffffff)
    this.sprite.drawCircle(0, 0, 25)
    
    // Make it interactive
    this.sprite.interactive = true
    this.sprite.buttonMode = true
  }

  public move(dx: number, dy: number): void {
    const newX = this.sprite.x + dx
    const newY = this.sprite.y + dy
    
    // Keep player within bounds (assuming 800x600 canvas)
    this.sprite.x = Math.max(25, Math.min(775, newX))
    this.sprite.y = Math.max(25, Math.min(575, newY))
  }

  public setPosition(x: number, y: number): void {
    this.sprite.x = x
    this.sprite.y = y
  }

  public getPosition(): { x: number; y: number } {
    return {
      x: this.sprite.x,
      y: this.sprite.y
    }
  }

  public setColor(color: number): void {
    this.sprite.clear()
    this.sprite.beginFill(color)
    this.sprite.drawCircle(0, 0, 25)
    this.sprite.endFill()
    this.sprite.lineStyle(3, 0xffffff)
    this.sprite.drawCircle(0, 0, 25)
  }
} 