// ----------------------------------------
// CONFIGURATION CONSTANTS
// ----------------------------------------

const WIN_SCORE = 25;
const HARD_MODE_SCORE = 12;
const GRAVITY = 0.5;
const JUMP_FORCE = 9;
const MAX_JUMP_HEIGHT = 220;
const GAME_WIDTH = 800;

let OBSTACLE_SPEED = 6;
let HARD_OBSTACLE_SPEED = 9;

const SPAWN_INTERVAL_MIN = 1200;
const SPAWN_INTERVAL_MAX = 2000;
const HARD_SPAWN_MIN = 800;
const HARD_SPAWN_MAX = 1400;

const HUNTER_INTERVAL = 20000;
const HUNTER_SPEED = 5;

// SPRITES
const FOX_IDLE = "./assets/standingfox.png";
const FOX_JUMP = "./assets/jumpfox.png";
const FOX_LAND = "./assets/landfox.png";

// OBSTACLE ASSETS
const obstacleTypes = [
  "./assets/log.png",
  "./assets/rock.png",
  "./assets/rock2.png",
  "./assets/trap.png"
];