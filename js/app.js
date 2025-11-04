/*
==========================================
🦊 FOX LEAP! — PSEUDOCODE
==========================================

SETUP:
  - DOM elements:
      • fox
      • obstacle
      • score
      • message
  
  - Initialize Variables:
      • position = 0
      • gravity = 0.9
      • isJumping = false
      • gameOver = false
      • score = 0
      • WIN_SCORE = 100

START GAME:
  - Display “Press Space or Enter to Start” message
  - On key press:
      • Begin obstacle movement
      • Enable jumping controls
      • Reset score and difficulty

JUMPING LOGIC:
  - When Spacebar is pressed and isJumping == false:
      • Set isJumping = true
      • Move fox upward (simulate jump)
      • Apply gravity to bring fox back down
      • Once landed, set isJumping = false

OBSTACLE MOVEMENT:
  - Move obstacle left continuously across the screen
  - When obstacle exits the left side:
      • Reset obstacle position to right side
      • Increase score by 1
      • Gradually increase speed for difficulty

COLLISION DETECTION:
  - Continuously check:
      • If fox’s bounding box overlaps obstacle’s bounding box:
          - Stop game loop
          - Display “Game Over! Try Again, Fox!” message

WIN CONDITION:
  - If score ≥ WIN_SCORE:
      • Display “You Win, Clever Fox! 🎉” message
      • Stop game loop
*/

// ----------------------------------------
// FOX LEAP — FINAL ANIMATED BUILD
// ----------------------------------------

const startBtn = document.getElementById("start-btn");
const fox = document.getElementById("fox");
const game = document.getElementById("game");
const message = document.getElementById("message");
const scoreDisplay = document.getElementById("score");

let isJumping = false;
let velocity = 0;
let foxBottom = 45;
let foxLeft = 80;
let score = 0;
let gameRunning = false;
let obstacles = [];
let activeHunter = null;
let lastSpawn = 0;
let spawnDelay = 2600;
const keysPressed = {};

// --- PHYSICS ---
const GRAVITY = 0.15;
const JUMP_FORCE = 13;
const MAX_JUMP_HEIGHT = 250;
let OBSTACLE_SPEED = 3.2;           // slow start
let FAST_OBSTACLE_SPEED = 6;        // after round 12
let FAST_SPAWN_DELAY = 1400;        // after round 12
const HUNTER_SPEED = 2.5;
const HUNTER_TRIGGER_SCORE = 10;
const HARD_MODE_SCORE = 12;
const WIN_SCORE = 25;

// --- SPRITES ---
const FOX_IDLE = "./assets/standingfox.png";
const FOX_JUMP = "./assets/jumpfox.png";
const FOX_LAND = "./assets/landfox.png";

// --- AUDIO ---
const audioBG = new Audio("./assets/background.mp3");
audioBG.loop = true;
audioBG.volume = 0.3;

// ----------------------------------------
// EVENT LISTENERS
// ----------------------------------------

startBtn.addEventListener("click", startGame);
document.addEventListener("keydown", handleKeyDown);
document.addEventListener("keyup", e => (keysPressed[e.code] = false));

function handleKeyDown(e) {
  if (!gameRunning) return;
  keysPressed[e.code] = true;
  if (
    (e.code === "Space" || e.code === "ArrowUp" || e.code === "KeyW") &&
    !isJumping
  ) {
    jump();
  }
}

// ----------------------------------------
// START GAME
// ----------------------------------------

function startGame() {
  console.clear();
  console.log("Game started ✅");
  foxBottom = 45;
  foxLeft = 80;
  velocity = 0;
  score = 0;
  isJumping = false;
  fox.src = FOX_IDLE;
  obstacles.forEach(o => o.remove());
  obstacles = [];
  if (activeHunter) {
    activeHunter.remove();
    activeHunter = null;
  }
  scoreDisplay.textContent = "Score: 0";
  message.textContent = "";
  startBtn.style.display = "none";

  gameRunning = true;
  OBSTACLE_SPEED = 3.2;
  spawnDelay = 2600;

  audioBG.currentTime = 0;
  audioBG.play().catch(() => {});

  requestAnimationFrame(updateGame);
}

// ----------------------------------------
// UPDATE GAME LOOP
// ----------------------------------------

function updateGame(timestamp) {
  if (!gameRunning) return;

  // Horizontal movement
  if (keysPressed["ArrowRight"] || keysPressed["KeyD"])
    foxLeft = Math.min(700, foxLeft + 5);
  if (keysPressed["ArrowLeft"] || keysPressed["KeyA"])
    foxLeft = Math.max(20, foxLeft - 5);
  fox.style.left = foxLeft + "px";

  // Jumping physics + animation
  foxBottom += velocity;
  velocity -= GRAVITY;

  // Highest jump limit
  if (foxBottom > MAX_JUMP_HEIGHT) {
    foxBottom = MAX_JUMP_HEIGHT;
    velocity = Math.min(velocity, 0);
  }

  // Landing
  if (foxBottom <= 45) {
    foxBottom = 45;
    if (isJumping) {
      isJumping = false;
      fox.src = FOX_LAND;
      setTimeout(() => (fox.src = FOX_IDLE), 200);
    }
    velocity = 0;
  }

  fox.style.bottom = foxBottom + "px";

  // Spawn obstacles
  if (timestamp - lastSpawn > spawnDelay) {
    spawnObstacle();
    lastSpawn = timestamp;
  }

  // Move obstacles + detect collisions
  for (let i = obstacles.length - 1; i >= 0; i--) {
    const obs = obstacles[i];
    let left = parseFloat(obs.style.left);
    left -= OBSTACLE_SPEED;
    obs.style.left = left + "px";

    // Remove off-screen
    if (left < -100) {
      obs.remove();
      obstacles.splice(i, 1);
      score++;
      scoreDisplay.textContent = `Score: ${score}`;

      // Hunter appears at round 10
      if (score === HUNTER_TRIGGER_SCORE && !activeHunter) {
        spawnHunter();
      }

      // Hard mode starts at round 12
      if (score === HARD_MODE_SCORE) {
        console.log("⚡ Hard Mode Activated!");
        OBSTACLE_SPEED = FAST_OBSTACLE_SPEED;
        spawnDelay = FAST_SPAWN_DELAY;
      }

      // Win condition
      if (score >= WIN_SCORE) {
        endGame(true);
        return;
      }
      continue;
    }

    // Collision check
    if (
      left < foxLeft + 45 &&
      left + 45 > foxLeft &&
      foxBottom < 110 &&
      foxBottom > 20
    ) {
      console.log("💥 Collision detected");
      endGame(false);
      return;
    }
  }

  // Occasional bonus spawn (adds tension in hard mode)
  if (score >= HARD_MODE_SCORE && Math.random() < 0.004) {
    spawnObstacle();
  }

  // Move hunter
  if (activeHunter) moveHunter();

  requestAnimationFrame(updateGame);
}

// ----------------------------------------
// SPAWN OBSTACLE
// ----------------------------------------

function spawnObstacle() {
  const obstacle = document.createElement("div");
  obstacle.classList.add("obstacle");
  const types = ["./assets/log.png", "./assets/rock.png", "./assets/rock2.png"];
  const img = types[Math.floor(Math.random() * types.length)];
  obstacle.style.backgroundImage = `url('${img}')`;
  obstacle.style.width = "60px";
  obstacle.style.height = "50px";
  obstacle.style.left = "900px";
  obstacle.style.bottom = "45px";
  game.appendChild(obstacle);
  obstacles.push(obstacle);
  console.log("Spawned:", img);
}

// ----------------------------------------
// SPAWN HUNTER
// ----------------------------------------

function spawnHunter() {
  const hunter = document.createElement("div");
  hunter.classList.add("hunter");
  hunter.style.left = "-120px";
  hunter.style.bottom = "45px";
  hunter.style.width = "42px";
  hunter.style.height = "80px";
  hunter.style.backgroundImage = "url('./assets/hunterrun.png')";
  hunter.style.backgroundSize = "contain";
  hunter.style.backgroundRepeat = "no-repeat";
  hunter.style.position = "absolute";
  hunter.style.imageRendering = "pixelated";
  game.appendChild(hunter);
  activeHunter = hunter;
  console.log("Hunter spawned 👣");
}

// ----------------------------------------
// MOVE HUNTER
// ----------------------------------------

function moveHunter() {
  let left = parseFloat(activeHunter.style.left);
  left += HUNTER_SPEED;
  activeHunter.style.left = left + "px";

  // Collision with fox
  if (
    left + 35 > foxLeft &&
    left < foxLeft + 45 &&
    foxBottom < 110 &&
    foxBottom > 20
  ) {
    console.log("🪓 Hunter caught you!");
    endGame(false);
    return;
  }

  // Remove hunter off-screen
  if (left > 900) {
    console.log("Hunter exited screen");
    activeHunter.remove();
    activeHunter = null;
  }
}

// ----------------------------------------
// JUMP
// ----------------------------------------

function jump() {
  isJumping = true;
  velocity = JUMP_FORCE;
  fox.src = FOX_JUMP;
}

// ----------------------------------------
// END GAME
// ----------------------------------------

function endGame(win) {
  gameRunning = false;
  audioBG.pause();
  obstacles.forEach(o => o.remove());
  obstacles = [];
  if (activeHunter) {
    activeHunter.remove();
    activeHunter = null;
  }
  message.textContent = win
    ? "🎉 You Win, Clever Fox!"
    : "💀 Game Over! Try Again!";
  startBtn.style.display = "inline-block";
  fox.src = FOX_IDLE;
  console.log("Game ended:", win ? "Win" : "Lose");
}