import { COLORS, GRAVITY, GROUND_Y, JUMP_VELOCITY } from '../utils/constants.js';

const WIDTH = 44;
const HEIGHT = 44;
const DUCK_WIDTH = 56;
const DUCK_HEIGHT = 26;

export class Dino {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = 50;
    this.y = GROUND_Y - HEIGHT;
    this.vy = 0;
    this.jumping = false;
    this.ducking = false;
    this.step = 0;
  }

  jump() {
    if (this.jumping) return;
    this.jumping = true;
    this.ducking = false;
    this.vy = JUMP_VELOCITY;
  }

  setDuck(on) {
    if (this.jumping) return;
    this.ducking = on;
  }

  update(dt) {
    this.step += dt;
    if (!this.jumping) return;

    this.vy += GRAVITY * dt;
    this.y += this.vy * dt;

    const floor = GROUND_Y - HEIGHT;
    if (this.y >= floor) {
      this.y = floor;
      this.vy = 0;
      this.jumping = false;
    }
  }

  get hitbox() {
    if (this.ducking) {
      return {
        x: this.x + 6,
        y: GROUND_Y - DUCK_HEIGHT + 4,
        w: DUCK_WIDTH - 12,
        h: DUCK_HEIGHT - 8,
      };
    }
    return { x: this.x + 8, y: this.y + 6, w: WIDTH - 18, h: HEIGHT - 10 };
  }

  render(ctx) {
    ctx.fillStyle = COLORS.dino;
    if (this.ducking) this.renderDucking(ctx);
    else this.renderStanding(ctx);
  }

  renderStanding(ctx) {
    const { x, y } = this;

    ctx.fillRect(x + 0, y + 16, 10, 7); // tail
    ctx.fillRect(x + 8, y + 12, 24, 22); // body
    ctx.fillRect(x + 24, y + 2, 18, 16); // head
    ctx.fillRect(x + 40, y + 12, 4, 6); // snout
    ctx.fillRect(x + 24, y + 22, 8, 4); // arm

    // eye
    ctx.fillStyle = COLORS.background;
    ctx.fillRect(x + 34, y + 6, 5, 5);
    ctx.fillStyle = COLORS.dino;
    ctx.fillRect(x + 36, y + 8, 3, 3);

    const legsUp = this.jumping ? -1 : Math.floor(this.step / 6) % 2;
    if (legsUp === -1) {
      ctx.fillRect(x + 12, y + 34, 6, 10);
      ctx.fillRect(x + 24, y + 34, 6, 10);
    } else if (legsUp === 0) {
      ctx.fillRect(x + 12, y + 34, 6, 10);
      ctx.fillRect(x + 24, y + 34, 6, 5);
    } else {
      ctx.fillRect(x + 12, y + 34, 6, 5);
      ctx.fillRect(x + 24, y + 34, 6, 10);
    }
  }

  renderDucking(ctx) {
    const x = this.x;
    const y = GROUND_Y - DUCK_HEIGHT;

    ctx.fillRect(x + 0, y + 8, 8, 6); // tail
    ctx.fillRect(x + 6, y + 4, 38, 16); // body
    ctx.fillRect(x + 38, y + 0, 18, 14); // head
    ctx.fillRect(x + 52, y + 10, 4, 4); // snout

    // eye
    ctx.fillStyle = COLORS.background;
    ctx.fillRect(x + 48, y + 3, 4, 4);
    ctx.fillStyle = COLORS.dino;
    ctx.fillRect(x + 50, y + 5, 2, 2);

    ctx.fillRect(x + 12, y + 20, 6, 6);
    ctx.fillRect(x + 26, y + 20, 6, 6);
  }
}
