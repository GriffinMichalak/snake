import { Component, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'snake';

  GRID_SIZE = 18; 
  SPEED = 100;

  direction = 'right'; 
  food: number = 116; 
  snake: number[] = [112, 111, 110]; // head is snake[0]
  gameActive = false; 
  gameOver = false;
  score = 0; 
  highScore = 0; 

  edges: number[] = []; 
  boxes: number[] = []; 
  
  constructor() {
    for (let i = 1; i <= this.GRID_SIZE * this.GRID_SIZE; i++) {
      this.boxes.push(i);
      
      // 1...18 | 18n | 18n + 1
      if (i <= this.GRID_SIZE || i % this.GRID_SIZE == 0 || (i-1) % this.GRID_SIZE == 0 || i >= (this.GRID_SIZE - 1) * this.GRID_SIZE) {
        this.edges.push(i);
      }
    }

  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'ArrowUp' && this.direction != 'down') {
      this.direction = 'up'; 
    } else if (event.key === 'ArrowDown' && this.direction != 'up') {
      this.direction = 'down'; 
    } else if (event.key === 'ArrowLeft' && this.direction != 'right') {
      this.direction = 'left';
    } else if (event.key === 'ArrowRight' && this.direction != 'left') {
      this.direction = 'right';
    }

    //console.log(this.direction);
  }

  startGameLoop() {
    this.gameActive = true; 
    this.gameOver = false;

    const intervalId = setInterval(() => {
      if (this.gameActive) {
        this.move();
        if(this.snake[0] == this.food) {
          this.eat(); 
        }

        if (this.isGameOver()) {
          this.gameActive = false;
          this.gameOver = true;
          alert(`Game over! Score: ${this.score}`);
          this.highScore = Math.max(this.highScore, this.score);
          this.resetGame(intervalId); 
        }
      }
    }, this.SPEED); // Move every 100ms (0.1 seconds)
  }

  eat() {
    console.log("nom nom");
    this.score++;
    this.spawnFood();
    const lastSegment = this.snake[this.snake.length - 1];
    this.snake.push(lastSegment);
  }

  spawnFood() {
    while (this.snake.includes(this.food) || this.edges.includes(this.food)) {
      this.food = Math.floor(Math.random() * (this.GRID_SIZE * this.GRID_SIZE)) + 1;
    }
  }

  move() {
    const head = this.snake[0];
    let newHead;

    switch (this.direction) {
      case 'up':
        newHead = head - this.GRID_SIZE;
        break;
      case 'down':
        newHead = head + this.GRID_SIZE;
        break;
      case 'left':
        newHead = head - 1;
        break;
      case 'right':
        newHead = head + 1;
        break;
    }

    // Move the snake
    this.snake = [newHead!, ...this.snake.slice(0, -1)];
  }

  isGameOver(): boolean {
    const head = this.snake[0];
    return this.edges.includes(head) || this.snake.slice(1).includes(head);
  }

  resetGame(intervalId: any) {
    this.score = 0; 
    this.direction = 'right'; 
    this.food = 116; 
    this.snake = [112, 111, 110]; // head is snake[0]
    this.gameActive = false; 
    this.gameOver = false;
    clearInterval(intervalId);
  }
}
