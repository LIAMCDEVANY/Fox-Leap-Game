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