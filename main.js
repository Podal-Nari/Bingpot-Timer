const tomato = document.getElementById('tomato');
const breakButton = document.getElementById('break-button');
const elapsed = document.getElementById('elapsed');
const remaining = document.getElementById('remaining');
const progress = document.getElementById('progress');
const timeInfo = document.querySelector('.time-info');
const progressBar = document.querySelector('.progress-bar');

const interactionSound = new Audio('./assets/interaction.wav');
const pauseSound = new Audio('./assets/pause.wav');
const studyOverSound = new Audio('./assets/studyover.wav');
const pomodoroOverSound = new Audio('./assets/pomodoroover.wav');
const breakMusic = new Audio('./assets/1-12 Noon.mp3');

let timer;
let startTime;
let isRunning = false;
let isPaused = false;
let isBreak = false;
let breakMusicPlayed = 0;
let initialStart = true;

function startTimer() {
  if (isRunning) return;
  isRunning = true;
  isPaused = false;

  if (initialStart) {
    interactionSound.play();
    changeTomatoImage('./assets/firsttomato.png');
    initialStart = false;
  }

  startTime = Date.now();
  timer = setInterval(updateTimer, 1000);
}

function updateTimer() {
  const elapsedMs = Date.now() - startTime;
  const elapsedSec = Math.floor(elapsedMs / 1000);

  if (!isBreak) {
    const remainingSec = 1500 - elapsedSec;

    elapsed.textContent = `+${formatTime(elapsedSec)}`;
    remaining.textContent = `-${formatTime(remainingSec)}`;
    progress.style.width = `${(elapsedSec / 1500) * 100}%`;

    if (elapsedSec >= 500 && elapsedSec < 1000) {
      changeTomatoImage('./assets/middletomato.png');
    } else if (elapsedSec >= 1000) {
      changeTomatoImage('./assets/lasttomato.png');
    }

    if (remainingSec <= 0) {
      clearInterval(timer);
      studyOverSound.play();
      startBreak();
    }
  } else {
    const remainingSec = 300 - elapsedSec;

    elapsed.textContent = `+${formatTime(elapsedSec)}`;
    remaining.textContent = `-${formatTime(remainingSec)}`;
    progress.style.width = `${(elapsedSec / 300) * 100}%`;

    if (elapsedSec >= 150 && elapsedSec < 250) {
      changeTomatoImage('./assets/middletomato.png');
    } else if (elapsedSec >= 250) {
      changeTomatoImage('./assets/firsttomato.png');
    }

    if (remainingSec <= 0) {
      clearInterval(timer);
      pomodoroOverSound.play();
      isRunning = false;
      isBreak = false;
      resetVisuals();
      resetToIdle(); // 대기 상태로 복귀
    }
  }
}

function startBreak() {
  isBreak = true;
  breakMusicPlayed = 0;
  breakMusic.play();
  breakMusic.addEventListener('ended', () => {
    breakMusicPlayed++;
    if (breakMusicPlayed < 2) {
      breakMusic.currentTime = 0;
      breakMusic.play();
    }
  });

  progressBar.style.background = "#d9fdd3"; 
  progress.style.background = "linear-gradient(90deg, #80c904, #4caf50)";
  timeInfo.style.color = "#4caf50";

  startTime = Date.now();
  timer = setInterval(updateTimer, 1000);
}

function resetVisuals() {
  progressBar.style.background = "#ffe0d1";
  progress.style.background = "linear-gradient(90deg, #ff6240, #ffa95d)";
  timeInfo.style.color = "#ff6347";
}

function resetToIdle() {
  elapsed.textContent = '+00:00';
  remaining.textContent = '-25:00';
  progress.style.width = '0%';
  tomato.src = './assets/middletomato.png';
  initialStart = true;
}

function changeTomatoImage(newSrc) {
  tomato.style.opacity = 0;
  setTimeout(() => {
    tomato.src = newSrc;
    tomato.style.opacity = 1;
  }, 300);
}

function formatTime(seconds) {
  const min = String(Math.floor(seconds / 60)).padStart(2, '0');
  const sec = String(seconds % 60).padStart(2, '0');
  return `${min}:${sec}`;
}

tomato.addEventListener('click', () => {
  if (!isRunning && !isPaused) {
    startTimer();
  }
});

breakButton.addEventListener('click', () => {
  if (isRunning && !isPaused) {
    pauseSound.play();
    clearInterval(timer);
    if (isBreak) {
      breakMusic.pause();
    }
    isPaused = true;
    isRunning = false;
  } else if (isPaused) {
    pauseSound.play();
    startTime = Date.now() - (parseTime(elapsed.textContent.slice(1)) * 1000);
    timer = setInterval(updateTimer, 1000);
    if (isBreak) {
      breakMusic.play();
    }
    isPaused = false;
    isRunning = true;
  }
});

function parseTime(timeString) {
  const [min, sec] = timeString.split(":").map(Number);
  return min * 60 + sec;
}
