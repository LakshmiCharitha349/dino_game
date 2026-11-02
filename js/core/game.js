import {
  ACCELERATION,
  BIRD_UNLOCK_SCORE,
  CANVAS,
  COLORS,
  HIGH_SCORE_KEY,
  MAX_SPEED,
  START_SPEED,
} from '../utils/constants.js';
import { Dino } from '../entities/dino.js';
import { Ground } from '../entities/ground.js';
import { Obstacle } from '../entities/obstacle.js';

const MENU = 'menu';
const PLAYING = 'playing';
const GAME_OVER = 'gameover';

const FRAME_MS = 1000 / 60;
const RESTART_DELAY_MS = 400;
const SCORE_DIVISOR = 10;

export class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.dino = new Dino();
    this.ground = new Ground();
    this.highScore = loadHighScore();
    this.state = MENU;
    this.lastTime = 0;
    this.reset();
    this.bindInput();
    this.loop = this.loop.bind(this);
  }

  reset() {
    this.dino.reset();
    this.ground.reset();
    this.obstacles = [];
    this.spawnTimer = 0;
    this.distance = 0;
    this.score = 0;
    this.speed = START_SPEED;
    this.gameOverAt = 0;
  }

  start() {
    this.reset();
    this.state = PLAYING;
  }

  end() {
    this.state = GAME_OVER;
    this.gameOverAt = performance.now();
    if (this.score > this.highScore) {
      this.highScore = this.score;
      saveHighScore(this.highScore);
    }
  }

  bindInput() {
    window.addEventListener('keydown', (event) => {
      if (event.code === 'Space' || event.code === 'ArrowUp' || event.code === 'KeyW') {
        event.preventDefault();
        if (!event.repeat) this.action();
      }
      if (event.code === 'ArrowDown' || event.code === 'KeyS') {
        event.preventDefault();
        this.dino.setDuck(true);
      }
    });

    window.addEventListener('keyup', (event) => {
      if (event.code === 'ArrowDown' || event.code === 'KeyS') this.dino.setDuck(false);
    });

    this.canvas.addEventListener('pointerdown', (event) => {
      event.preventDefault();
      this.action();
    });
  }

  action() {
    if (this.state === MENU) {
      this.start();
      return;
    }
    if (this.state === GAME_OVER) {
      if (performance.now() - this.gameOverAt > RESTART_DELAY_MS) this.start();
      return;
    }
    this.dino.jump();
  }

  update(dt) {
    if (this.state !== PLAYING) return;

    this.speed = Math.min(this.speed + ACCELERATION * dt, MAX_SPEED);
    this.dino.update(dt);
    this.ground.update(dt, this.speed);

    this.distance += this.speed * dt;
    this.score = Math.floor(this.distance / SCORE_DIVISOR);

    this.spawnTimer -= dt;
    if (this.spawnTimer <= 0) this.spawn();

    for (const obstacle of this.obstacles) obstacle.update(dt, this.speed);
    this.obstacles = this.obstacles.filter((obstacle) => !obstacle.isOffscreen());

    const hit = this.obstacles.some((obstacle) => overlaps(this.dino.hitbox, obstacle.hitbox));
    if (hit) this.end();
  }

  spawn() {
    let type = Math.random() < 0.5 ? 'cactus-small' : 'cactus-large';
    if (this.score > BIRD_UNLOCK_SCORE && Math.random() < 0.3) type = 'bird';

    this.obstacles.push(new Obstacle(type, CANVAS.width + 20));

    // gap is measured in frames so spacing stays fair as the world speeds up
    this.spawnTimer = 50 + Math.random() * 30;
  }

  render() {
    const { ctx } = this;

    ctx.fillStyle = COLORS.background;
    ctx.fillRect(0, 0, CANVAS.width, CANVAS.height);

    this.ground.render(ctx);
    for (const obstacle of this.obstacles) obstacle.render(ctx);
    this.dino.render(ctx);
    this.renderScore();

    if (this.state === MENU) {
      this.renderText('PRESS SPACE OR TAP TO START', 64, 'bold 14px ui-monospace, Menlo, monospace');
    }
    if (this.state === GAME_OVER) {
      this.renderText('GAME OVER', 60, 'bold 20px ui-monospace, Menlo, monospace');
      this.renderText(
        'PRESS SPACE OR TAP TO RESTART',
        86,
        '12px ui-monospace, Menlo, monospace',
      );
    }
  }

  renderScore() {
    const { ctx } = this;
    const score = String(this.score).padStart(5, '0');
    const high = String(this.highScore).padStart(5, '0');

    ctx.fillStyle = COLORS.text;
    ctx.font = 'bold 16px ui-monospace, Menlo, monospace';
    ctx.textAlign = 'right';
    ctx.fillText(this.highScore > 0 ? `HI ${high}  ${score}` : score, CANVAS.width - 16, 28);
  }

  renderText(text, y, font) {
    const { ctx } = this;
    ctx.fillStyle = COLORS.text;
    ctx.font = font;
    ctx.textAlign = 'center';
    ctx.fillText(text, CANVAS.width / 2, y);
  }

  startLoop() {
    requestAnimationFrame((time) => {
      this.lastTime = time;
      this.loop(time);
    });
  }

  loop(time) {
    const dt = Math.min((time - this.lastTime) / FRAME_MS, 3);
    this.lastTime = time;

    this.update(dt);
    this.render();

    requestAnimationFrame(this.loop);
  }
}

function overlaps(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

function loadHighScore() {
  try {
    return Number(localStorage.getItem(HIGH_SCORE_KEY)) || 0;
  } catch {
    return 0;
  }
}

function saveHighScore(value) {
  try {
    localStorage.setItem(HIGH_SCORE_KEY, String(value));
  } catch {
    // storage may be unavailable (private mode); score just won't persist
  }
}
