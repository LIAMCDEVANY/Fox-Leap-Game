// --------------------------
// Fox Leap! Constants (refined physics and visuals)
// --------------------------

const GAME_WIDTH = 800;
const GAME_HEIGHT = 300;

// Physics

const GRAVITY = 0.18;
const JUMP_FORCE = 7.2;
const MAX_JUMP_HEIGHT = 210;

// Obstacles

let OBSTACLE_SPEED = 4;
const SPAWN_INTERVAL_MIN = 2200;
const SPAWN_INTERVAL_MAX = 4200;

// Difficulty scaling

const HARD_MODE_SCORE = 8;
const HARD_OBSTACLE_SPEED = 6;
const HARD_SPAWN_MIN = 1500;
const HARD_SPAWN_MAX = 3000;

// Win condition
const WIN_SCORE = 15;

// Sprites
const FOX_IDLE = "./assets/standingfox.png";
const FOX_JUMP = "./assets/jumpfox.png";
const FOX_LAND = "./assets/landfox.png";
