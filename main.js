const tomato = document.getElementById('tomato');
const breakButton = document.getElementById('break-button');
const elapsed = document.getElementById('elapsed');
const remaining = document.getElementById('remaining');
const progress = document.getElementById('progress');

const interactionSound = new Audio('./assets/interaction.wav');
const pauseSound = new Audio('./assets/pause.wav');
const studyOverSound = new Audio('./assets/studyover.wav');
const pomodoroOverSound = new Audio('./assets/pomodoroover.wav');
const breakMusic = new Audio('./assets/1-12 Noon.mp3');

let timer;
let startTime;
let isRunning = false;
let isBreak = false;
let breakMusicPlayed = 0;

function startTimer() {
  if (isRunning) return;
  isRunning = true;
  interactionSound.play();

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

    // 토마토 익히기 로직
    if (elapsedSec >= 500 && elapsedSec < 1000) {
      tomato.src = './assets/middletomato.png';
    } else if (elapsedSec >= 1000) {
      tomato.src = './assets/lasttomato.png';
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

    if (remainingSec <= 0) {
      clearInterval(timer);
      pomodoroOverSound.play();
      isRunning = false;
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
  startTime = Date.now();
  timer = setInterval(updateTimer, 1000);
}

function formatTime(seconds) {
  const min = String(Math.floor(seconds / 60)).padStart(2, '0');
  const sec = String(seconds % 60).padStart(2, '0');
  return `${min}:${sec}`;
}

tomato.addEventListener('click', startTimer);

breakButton.addEventListener('click', () => {
  if (isRunning) {
    pauseSound.play();
    clearInterval(timer);
    isRunning = false;
  }
});
