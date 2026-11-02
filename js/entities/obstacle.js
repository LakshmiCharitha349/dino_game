import { COLORS, GROUND_Y } from '../utils/constants.js';

const TYPES = {
  'cactus-small': { w: 20, h: 42, flying: false },
  'cactus-large': { w: 28, h: 54, flying: false },
  bird: { w: 40, h: 26, flying: true },
};

export class Obstacle {
  constructor(type, x) {
    const spec = TYPES[type];
    this.type = type;
    this.width = spec.w;
    this.height = spec.h;
    this.x = x;
    this.y = spec.flying ? GROUND_Y - 56 : GROUND_Y - spec.h;
    this.flap = 0;
  }

  update(dt, speed) {
    this.x -= speed * dt;
    this.flap += dt;
  }

  isOffscreen() {
    return this.x + this.width < 0;
  }

  get hitbox() {
    return { x: this.x + 4, y: this.y + 3, w: this.width - 8, h: this.height - 6 };
  }

  render(ctx) {
    ctx.fillStyle = COLORS.obstacle;
    if (this.type === 'bird') this.renderBird(ctx);
    else this.renderCactus(ctx);
  }

  renderCactus(ctx) {
    const { x, y } = this;

    if (this.type === 'cactus-small') {
      ctx.fillRect(x + 7, y, 6, 42); // trunk
      ctx.fillRect(x + 0, y + 16, 8, 4); // left arm
      ctx.fillRect(x + 0, y + 6, 4, 14);
      ctx.fillRect(x + 12, y + 10, 8, 4); // right arm
      ctx.fillRect(x + 16, y + 2, 4, 12);
    } else {
      ctx.fillRect(x + 10, y, 8, 54); // trunk
      ctx.fillRect(x + 0, y + 22, 11, 5); // left arm
      ctx.fillRect(x + 0, y + 10, 5, 17);
      ctx.fillRect(x + 17, y + 14, 11, 5); // right arm
      ctx.fillRect(x + 23, y + 4, 5, 15);
    }
  }

  renderBird(ctx) {
    const { x, y } = this;
    const wingUp = Math.floor(this.flap / 8) % 2 === 0;

    ctx.fillRect(x + 8, y + 10, 22, 8); // body
    ctx.fillRect(x + 26, y + 6, 10, 8); // head
    ctx.fillRect(x + 34, y + 10, 6, 3); // beak
    if (wingUp) ctx.fillRect(x + 12, y, 16, 8);
    else ctx.fillRect(x + 12, y + 16, 16, 8);

    // eye
    ctx.fillStyle = COLORS.background;
    ctx.fillRect(x + 30, y + 8, 3, 3);
    ctx.fillStyle = COLORS.obstacle;
  }
}
