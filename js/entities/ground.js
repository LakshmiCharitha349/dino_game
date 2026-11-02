import { CANVAS, COLORS, GROUND_Y } from '../utils/constants.js';

const TILE = 80;

export class Ground {
  constructor() {
    this.offset = 0;
  }

  reset() {
    this.offset = 0;
  }

  update(dt, speed) {
    this.offset = (this.offset + speed * dt) % TILE;
  }

  render(ctx) {
    ctx.fillStyle = COLORS.ground;
    ctx.fillRect(0, GROUND_Y, CANVAS.width, 2);

    for (let x = -this.offset; x < CANVAS.width; x += TILE) {
      ctx.fillRect(x + 20, GROUND_Y + 10, 16, 2);
      ctx.fillRect(x + 54, GROUND_Y + 18, 10, 2);
      ctx.fillRect(x + 8, GROUND_Y + 26, 4, 2);
    }
  }
}
