# rough.md

Scratch notes for the dino game. Unstructured on purpose.

## Core loop
- [ ] canvas render, fixed timestep update
- [ ] dino runs in place, world scrolls left
- [ ] jump (space / up / tap), variable jump height by hold time
- [ ] duck (down) — needed once birds exist
- [ ] obstacles spawn at random gaps, faster over time
- [ ] collision hitbox smaller than sprite (forgiving)

## Entities
- dino — states: idle, run, jump, duck, dead
- obstacle — cactus (ground), bird (2 heights)
- ground — repeat texture, speed tied to game speed
- cloud — parallax decoration, random y
- particle — dust on landing / hit

## Scoring
- score = distance / 10 (rough), ticks up while alive
- milestone every 100 pts -> blink score, tiny sound
- high score in localStorage, "HI 00000" in HUD

## Speed / difficulty
- baseSpeed 6 px/frame-ish, +0.001 per frame, cap ~13
- obstacle gap shrinks with speed, keep min gap so it stays fair

## States
menu -> playing <-> paused -> gameover -> (restart) playing

## UI
- start screen: "Press Space / Tap to start"
- gameover: "GAME OVER" + restart icon, click or space
- mute toggle, day/night flip every 700 pts (stretch)

## Assets
- sprites first pass: solid rects/placeholder shapes, real art later
- sounds: jump, point, hit, optional bgm

## Open questions
- mobile: on-screen jump/duck buttons or swipe?
- fixed canvas size (e.g. 600x150 like chrome) vs responsive scaling?
- vanilla JS modules or Vite + TS? currently scaffolded vanilla ES modules
- touch + keyboard both from day 1, or keyboard first?

## Later / nice-to-have
- pause on tab blur
- reduced motion / mute persistence
- simple easter egg: pterodactyl swarm at night
- seedable RNG for replay + tests

## Next action
1. index.html + canvas
2. loop.js + input.js
3. dino.js move/jump
4. ground scroll
5. first cactus + collision
