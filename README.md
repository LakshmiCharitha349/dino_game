# Dino Game

A simple endless runner inspired by the Chrome offline dinosaur game. Vanilla JS + canvas, no dependencies.

## Run

ES modules need a server (opening the file directly won't load `js/main.js`):

```sh
python3 -m http.server 8000
```

Then open http://localhost:8000

## Controls

- Space / ↑ / W: jump, start, restart
- ↓ / S: duck (hold)
- Tap the canvas: jump, start, restart

## Structure

```
index.html
css/main.css
js/
├── main.js               # bootstrap
├── core/game.js          # state machine, loop, input, spawn, collision, scoring
├── entities/
│   ├── dino.js           # run/jump/duck, hitbox, drawing
│   ├── obstacle.js       # cacti + birds, hitbox, drawing
│   └── ground.js         # scrolling ground
└── utils/constants.js    # tuning values and colors
```

## Notes

- `js/core/game.js` uses a fixed-step frame model: `update(dt)` receives elapsed time
  in 60fps frames (clamped to 3), so physics are frame-rate independent.
- Physics, speed and colors are tuned in `js/utils/constants.js`.
- High score is stored in `localStorage` (`dino-high-score`) and fails silently if storage is blocked.
- Art is placeholder pixel shapes drawn with `fillRect`; swap in sprites later.
