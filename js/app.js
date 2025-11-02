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

// ----------------------------
// FOX LEAP! MAIN GAME SCRIPT
// ----------------------------

const startBtn = document.getElementById("start-btn");
const fox = document.getElementById("fox");
const game = document.getElementById("game");
const message = document.getElementById("message");
const scoreDisplay = document.getElementById("score");

let isJumping = false;
let velocity = 0;
let foxBottom = 72;
let score = 0;
let gameRunning = false;
let obstacles = [];

// ----------------------------
// EVENT LISTENERS
// ----------------------------
startBtn.addEventListener("click", startGame);
document.addEventListener("keydown", handleKeyDown);

// ----------------------------
// START + RESTART
// ----------------------------
function startGame() {
  score = 0;
  foxBottom = 72;
  velocity = 0;
  scoreDisplay.textContent = "Score: 0";
  message.textContent = "";
  startBtn.style.display = "none";
  fox.src = FOX_IDLE;

  // Clear old obstacles
  obstacles.forEach(o => o.remove());
  obstacles = [];
  gameRunning = true;

  spawnObstacle();
  requestAnimationFrame(updateGame);
}

function handleKeyDown(e) {
  if ((e.code === "Space" || e.code === "ArrowUp") && !isJumping && gameRunning) {
    jump();
  }
  if (e.code === "KeyR" && !gameRunning) startGame();
}

// ----------------------------
// MAIN GAME LOOP
// ----------------------------
function updateGame() {
  if (!gameRunning) return;

  // Apply gravity
  foxBottom += velocity;
  velocity -= GRAVITY;

  // Limit jump height
  if (foxBottom > MAX_JUMP_HEIGHT) {
    foxBottom = MAX_JUMP_HEIGHT;
    velocity = Math.min(velocity, 0);
  }

  // Floor collision
  if (foxBottom <= 72) {
    foxBottom = 72;
    if (isJumping) {
      createDustPuff();
      fox.src = FOX_LAND;
      setTimeout(() => fox.src = FOX_IDLE, 250);
    }
    isJumping = false;
    velocity = 0;
  }

  fox.style.bottom = foxBottom + "px";
  requestAnimationFrame(updateGame);
}

// ----------------------------
// JUMP
// ----------------------------
function jump() {
  isJumping = true;
  velocity = JUMP_FORCE;
  fox.src = FOX_JUMP;
}

// ----------------------------
// OBSTACLE SPAWNING
// ----------------------------
function spawnObstacle() {
  if (!gameRunning) return;

  const obstacle = document.createElement("div");
  obstacle.classList.add("obstacle");

  const isLog = Math.random() > 0.5;
  const imgPath = isLog ? "./assets/log.png" : "./assets/rock.png";

  obstacle.style.backgroundImage = `url('${imgPath}')`;
  obstacle.style.width = "64px";
  obstacle.style.height = "64px";
  obstacle.style.left = GAME_WIDTH + "px";
  obstacle.style.bottom = isLog ? "68px" : "66px";
  obstacle.style.zIndex = "5";

  game.appendChild(obstacle);
  obstacles.push(obstacle);

  // Move obstacle (single control loop)
  const moveInterval = setInterval(() => {
    if (!gameRunning) {
      clearInterval(moveInterval);
      obstacle.remove();
      return;
    }

    let left = parseInt(obstacle.style.left);
    left -= OBSTACLE_SPEED;
    obstacle.style.left = left + "px";

    // Collision check
    if (left < 80 + 50 && left + 50 > 80 && foxBottom < 110) {
      endGame(false);
      clearInterval(moveInterval);
      return;
    }

    // Off-screen cleanup & score
    if (left < -64) {
      clearInterval(moveInterval);
      obstacle.remove();
      obstacles.splice(obstacles.indexOf(obstacle), 1);

      // ✅ Only score once per obstacle
      score++;
      scoreDisplay.textContent = `Score: ${score}`;

      if (score === HARD_MODE_SCORE) OBSTACLE_SPEED = HARD_OBSTACLE_SPEED;
      if (score >= WIN_SCORE) {
        endGame(true);
        return;
      }
    }
  }, 20);

  // Random delay before next spawn
  const isHard = score >= HARD_MODE_SCORE;
  const minDelay = isHard ? HARD_SPAWN_MIN : SPAWN_INTERVAL_MIN;
  const maxDelay = isHard ? HARD_SPAWN_MAX : SPAWN_INTERVAL_MAX;
  const delay = Math.random() * (maxDelay - minDelay) + minDelay;

  setTimeout(() => {
    if (gameRunning) spawnObstacle();
  }, delay);
}

// ----------------------------
// DUST PUFF
// ----------------------------
function createDustPuff() {
  const puff = document.createElement("div");
  puff.style.position = "absolute";
  puff.style.bottom = "72px";
  puff.style.left = "100px";
  puff.style.width = "20px";
  puff.style.height = "10px";
  puff.style.borderRadius = "50%";
  puff.style.background = "rgba(180, 140, 90, 0.8)";
  puff.style.filter = "blur(3px)";
  puff.style.zIndex = "2";
  game.appendChild(puff);

  puff.animate(
    [
      { transform: "scale(1)", opacity: 1 },
      { transform: "scale(2)", opacity: 0 }
    ],
    { duration: 400, easing: "ease-out" }
  );

  setTimeout(() => puff.remove(), 400);
}

// ----------------------------
// END GAME
// ----------------------------
function endGame(win) {
  gameRunning = false;
  obstacles.forEach(o => o.remove());
  obstacles = [];
  message.textContent = win ? "You Win!" : "Game Over!";
  startBtn.style.display = "inline-block";
  fox.src = FOX_IDLE;
}