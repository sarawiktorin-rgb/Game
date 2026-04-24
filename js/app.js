// Variables that can change during the game, such as time, score, and player name
let score = 0;
let timeLeft = 5;
let gameStarted = false;
let gameEnded = false;
let interval = null;
let submittedName = "";
let submittedScore = 0;

// DOM elements retrieved from index.html and used throughout the game
const title = document.getElementById('title');
const button1 = document.getElementById('button1');
const button2 = document.getElementById('button2');
const scoreDisplay = document.getElementById('scoreDisplay');
const timerDisplay = document.getElementById('timerDisplay');
const input1 = document.getElementById('name');
const timerBox = document.getElementById('timerBox');
const playAgain = document.getElementById('playAgain');
const scoreBox = document.getElementById('scoreBox');
const scoreboard = document.getElementById('scoreboard');
const scoreboardTitle = document.getElementById('scoreboardTitle');
const loadingText = document.getElementById('loadingText');

// When button1 is clicked, increase score and start the game if not already started
button1.addEventListener('click', () => {
  if (!gameEnded) {
    increaseScore();
  }
  if(!gameStarted) {
    startGame();
  }
})

// When button2 is clicked, submit high score
button2.addEventListener('click', () => {
  submitHighScore();
})

// When play again button is clicked, reload the page
playAgain.addEventListener('click', () => {
  location.reload();
});

// Hide elements at the start
input1.style.display = 'none';
button2.style.display = 'none';
playAgain.style.display = 'none';
scoreboard.style.display = 'none';
scoreboardTitle.style.display = 'none';

// Increase score by 1 and display the score
function increaseScore() {
  score++;
  scoreDisplay.innerText = score;
}

// Decrease time, display time left, and end the game when time reaches 0
function countdown() {
    timeLeft--;
    timerDisplay.innerText = timeLeft;

    if(timeLeft <= 0) {
      endGame();
      timerDisplay.innerText = 0;
    }
}

// Start the game and begin the countdown timer
function startGame() {
  interval = setInterval(countdown, 1000);
  gameStarted = true;
}

// End the game and stop the countdown timer
function endGame() {
  gameEnded = true;
  clearInterval(interval);

  title.innerText = "Game Over"; // Update the title to show "Game Over"

  // Hide elements
  timerBox.style.display = 'none';
  button1.style.display = 'none';
  playAgain.style.display = 'none';
  scoreboard.style.display = 'none';
  scoreboardTitle.style.display = 'none';

  // Show input1 and button2
  input1.style.display = 'block';
  button2.style.display = 'block';
}

async function submitHighScore() {
  const currentScore = score;     // Get the current score
  submittedName = input1.value.trim();      // Get the name
  submittedScore = currentScore;

  // Send name and score to the API
  try {
    const response = await fetch("https://hooks.zapier.com/hooks/catch/8338993/ujs9jj9/", {
      method: "POST",
      body: JSON.stringify({
        name: submittedName,
        score: currentScore
      })
    });

    console.log(response);

    // Change title to "You have submitted your score"
    title.innerText = "You have submitted your score!";

    // Hide elements
    scoreDisplay.style.display = 'none';
    input1.style.display = 'none';
    button2.style.display = 'none';
    scoreBox.style.display = 'none';
    scoreboard.style.display = 'none';

    // Show elements
    loadingText.style.display = 'block';
    playAgain.style.display = 'block';
    scoreboard.style.display = 'block';
    scoreboardTitle.style.display = 'block';

    // Wait (5 sec) before fetching leaderboard to allow API update
    setTimeout(() => {
      getScoreBoardData();
    }, 5000);

    // Log error if the request fails
  } catch (error) {
    console.log(error);
  }
}

// Fetch scoreboard data and display it
function getScoreBoardData() {
  const url = 'https://script.google.com/macros/s/AKfycbys5aEPMvNCutyhNYYCcQcCjzsi2UtqNspmKyCH-AicJxJbCJMrAoT0LUaYaXhTWA8n/exec';

  fetch(url)
    .then(response => response.json())
    .then(data => {

      // Hide element
      loadingText.style.display = 'none';

      // Show element
      scoreboard.style.display = 'block';

      // Filter scores (max 50)
      data = data.filter(player => Number(player.score) <= 50);

      // Sort scores in descending order
      data.sort((a, b) => Number(b.score) - Number(a.score));

      // Clear previous scoreboard
      scoreboard.innerHTML = '';

      // Create and display the leaderboard list
      data.forEach((player, index) => {
        const li = document.createElement('li');

        // Create a list with rank, name and score
        li.innerHTML = `
    <span>${index + 1}. ${player.name}</span>
    <span>${player.score}</span>
  `;

        // Highlight the player's score
        if (
          player.name.trim() === submittedName &&
          Number(player.score) === Number(submittedScore)
        ) {
          li.classList.add('highlight');
        }

        // Add item to scoreboard
        scoreboard.appendChild(li);
      });

    })
    // Log error if fetch fails
    .catch(error => {
      console.error('Fetch error:', error);
    });
}



