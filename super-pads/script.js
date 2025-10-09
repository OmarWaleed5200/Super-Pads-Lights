// =============================
// SUPER PADS LIGHTS CLONE SCRIPT
// =============================

// Get buttons
const recordBtn = document.getElementById("record");
const stopBtn = document.getElementById("stop");
const playBtn = document.getElementById("play");
const clearBtn = document.getElementById("clear");
const loopBtn = document.getElementById("loop");

// Pad and sound setup
const pads = document.querySelectorAll(".pad");
let recording = false;
let recordedSequence = [];
let startTime = 0;
let loopEnabled = false;
let loopInterval = null;

// =============================
// SOUND PLAYBACK
// =============================
function playSound(key) {
  const audio = document.getElementById(key);
  if (audio) {
    audio.currentTime = 0;
    audio.play();
  }
}

// =============================
// PAD GLOW ANIMATION
// =============================
function flashPad(key) {
  const pad = document.querySelector(`.pad[data-key="${key}"]`);
  if (pad) {
    pad.classList.add("active");
    setTimeout(() => pad.classList.remove("active"), 200);
  }
}

// =============================
// RECORDING LOGIC
// =============================
pads.forEach((pad) => {
  pad.addEventListener("click", () => handlePadPress(pad.dataset.key));
});

document.addEventListener("keydown", (e) => {
  const key = e.key.toLowerCase();
  const pad = document.querySelector(`.pad[data-key="${key}"]`);
  if (pad) handlePadPress(key);
});

function handlePadPress(key) {
  playSound(key);
  flashPad(key);

  if (recording) {
    const time = performance.now() - startTime;
    recordedSequence.push({ key, time });
  }
}

// =============================
// RECORD BUTTON
// =============================
recordBtn.addEventListener("click", () => {
  recordedSequence = [];
  recording = true;
  startTime = performance.now();
  recordBtn.classList.add("active");
  console.log("Recording started...");
});

// =============================
// STOP BUTTON
// =============================
stopBtn.addEventListener("click", () => {
  recording = false;
  recordBtn.classList.remove("active");
  console.log("Recording stopped.");
});

// =============================
// PLAY SEQUENCE
// =============================
function playSequence(loop = false) {
  if (recordedSequence.length === 0) return;

  recordedSequence.forEach((event) => {
    setTimeout(() => {
      playSound(event.key);
      flashPad(event.key);
    }, event.time);
  });

  // If loop is enabled, repeat the sequence
  if (loop) {
    const totalDuration = recordedSequence[recordedSequence.length - 1].time;
    clearInterval(loopInterval);
    loopInterval = setInterval(() => {
      recordedSequence.forEach((event) => {
        setTimeout(() => {
          playSound(event.key);
          flashPad(event.key);
        }, event.time);
      });
    }, totalDuration + 500);
  }
}

// =============================
// PLAY BUTTON
// =============================
playBtn.addEventListener("click", () => {
  playSequence(loopEnabled);
});

// =============================
// CLEAR BUTTON
// =============================
clearBtn.addEventListener("click", () => {
  recordedSequence = [];
  recording = false;
  clearInterval(loopInterval);
  loopEnabled = false;
  loopBtn.classList.remove("active");
  console.log("Sequence cleared.");
});

// =============================
// LOOP BUTTON
// =============================
loopBtn.addEventListener("click", () => {
  loopEnabled = !loopEnabled;
  loopBtn.classList.toggle("active", loopEnabled);

  if (loopEnabled) {
    playSequence(true);
    console.log("Loop mode: ON");
  } else {
    clearInterval(loopInterval);
    console.log("Loop mode: OFF");
  }
});
