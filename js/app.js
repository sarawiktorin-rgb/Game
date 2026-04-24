// Variables
let score = 0;
let timeLeft = 5;
let gameStarted = false;
let gameEnded = false;
let interval = null;
let submittedName = "";
let submittedScore = 0;

// HTML DOM
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
button2.style.display = 'none';
playAgain.style.display = 'none';
scoreboard.style.display = 'none';
scoreboardTitle.style.display = 'none';

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
  button2.style.display = 'block';
  playAgain.style.display = 'none';
  scoreboard.style.display = 'none';
  scoreboardTitle.style.display = 'none';
}

async function submitHighScore() {
  const currentScore = score; // använder spelets score
  submittedName = input1.value.trim();
  submittedScore = currentScore;

  try {
    const response = await fetch("https://hooks.zapier.com/hooks/catch/8338993/ujs9jj9/", {
      method: "POST",
      body: JSON.stringify({
        name: input1.value,
        score: currentScore
      })
    });

    console.log(response);

    title.innerText = "You have submitted your score!";

    scoreDisplay.style.display = 'none';
    input1.style.display = 'none';
    button2.style.display = 'none';
    scoreBox.style.display = 'none';
    loadingText.style.display = 'block';
    scoreboard.style.display = 'none';
    playAgain.style.display = 'block';

    scoreboard.style.display = 'block';
    scoreboardTitle.style.display = 'block';
    setTimeout(() => {
      getScoreBoardData();
    }, 5000);

  } catch (error) {
    console.log(error);
  }
}

playAgain.addEventListener('click', () => {
  location.reload();
});

function getScoreBoardData() {
  const url = 'https://script.google.com/macros/s/AKfycbys5aEPMvNCutyhNYYCcQcCjzsi2UtqNspmKyCH-AicJxJbCJMrAoT0LUaYaXhTWA8n/exec';

  fetch(url)
    .then(response => response.json())
    .then(data => {

      loadingText.style.display = 'none';
      scoreboard.style.display = 'block';

      data = data.filter(player => Number(player.score) <= 50);
      data.sort((a, b) => Number(b.score) - Number(a.score));

      scoreboard.innerHTML = '';

      data.forEach((player, index) => {
        const li = document.createElement('li');

        li.innerHTML = `
    <span>${index + 1}. ${player.name}</span>
    <span>${player.score}</span>
  `;

        if (
          player.name.trim() === submittedName &&
          Number(player.score) === Number(submittedScore)
        ) {
          li.classList.add('highlight');
        }

        scoreboard.appendChild(li);
      });

    })
    .catch(error => {
      console.error('Fetch error:', error);
    });
}



