# Voyage to Hawaiʻi

A family-friendly, choice-driven browser adventure inspired by traditional Polynesian voyaging and wayfinding. Guide a fictional crew toward Hawaiʻi while managing food, water, morale, and canoe condition.

## Play
Open `index.html` in a modern browser, or enable GitHub Pages under repository Settings → Pages to host the game.

## Controls
Click or tap a choice each turn. Survive the voyage and reach land.

## How the game works
Reach 19 travel while keeping food, water, crew spirit, and hull above zero. Each resource is capped at 15. Choice buttons show the exact net changes, including that turn's food and water use; gains are limited by the resource cap. There is no hidden extra travel or supply deduction.

Fish to replenish food, collect rain to replenish water, rest to restore spirit, and repair leaks to improve the hull. Some actions use a whole turn without moving the canoe. Depleting any resource ends the voyage, even if you reach the destination on the same turn. These are simplified game rules, not real-world navigation instructions.

The scene, resources, choices, and learning feedback share a compact two-column layout on laptop and desktop screens. Smaller screens stack the panels so all controls remain accessible.

## Development checks
With Node.js installed, run `node --test tests/game.test.cjs` to check resource accounting, caps, choice previews, losing conditions, a complete winning voyage, and restart behavior. No dependencies are needed.

## About
This is an early playable prototype, not a historically complete portrayal of the first settlement of Hawaiʻi. Future versions should include careful research, consultation with Native Hawaiian cultural experts, illustrated scenes, and more nuanced navigation systems.
