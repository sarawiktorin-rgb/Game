// Click a button or object to earn points so that I can increase my score.
// See my current score during the game so that I know how well I am doing.
// See a countdown timer so that I know how much time is left.

// Variables
let score = 0;
let timeLeft = 5;
let gameStarted = false;
let gameEnded = false;
let interval = null;

// HTML DOM
const title = document.getElementById('title');
const button1 = document.getElementById('button1');
const button2 = document.getElementById('button2');
const scoreDisplay = document.getElementById('scoreDisplay');
const timerDisplay = document.getElementById('timerDisplay');
const label1 = document.getElementById('label1');
const input1 = document.getElementById('name');
const timerBox = document.getElementById('timerBox');

// UI Functions & Events
button1.addEventListener('click', () => {
  if (!gameEnded) {
    increaseScore();
  }

  if(!gameStarted) {
    startGame();
  }
})

button2.addEventListener('click', () => {
  submitHighScore();
})

input1.style.display = 'none';
label1.style.display = 'none';
button2.style.display = 'none';

// Functions
function increaseScore() {
  score++;
  scoreDisplay.innerText = score;
}
function countdown() {
    timeLeft--;
    timerDisplay.innerText = timeLeft;

    if(timeLeft <= 0) {
      endGame();
      timerDisplay.innerText = 0;
    }
}

function startGame() {
  interval = setInterval(countdown, 1000);
  gameStarted = true;
}

function endGame() {
  gameEnded = true;
  clearInterval(interval);

  title.innerText = "Game Over";
  timerBox.style.display = 'none';

  button1.style.display = 'none';
  input1.style.display = 'block';
  label1.style.display = 'block';
  button2.style.display = 'block';
}

async function submitHighScore() {
  const currentScore = score; // använder spelets score

  try {
    const response = await fetch("https://hooks.zapier.com/hooks/catch/8338993/ujs9jj9/", {
      method: "POST",
      body: JSON.stringify({
        name: input1.value,
        score: currentScore
      })
    });

    console.log(response);
  } catch (error) {
    console.log(error);
  }
}

function getScoreBoardData() {
  const url = 'https://script.google.com/macros/s/AKfycbys5aEPMvNCutyhNYYCcQcCjzsi2UtqNspmKyCH-AicJxJbCJMrAoT0LUaYaXhTWA8n/exec';
  fetch(url)
    .then(response => {
      console.log('Response object:', response);
      return response.json();
    })
    .then(data => {
      console.log('Scoreboard data:', data);

      data.forEach((player, index) => {
        console.log(`Row ${index + 1}: Name=${player.name}, Score=${player.score}`);
      });
    })
    .catch(error => {
      console.error('Fetch error:', error);
    });
}
getScoreBoardData();

// post value to API.
// create and read. name + high score
// zapier.com



