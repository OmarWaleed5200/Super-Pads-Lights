// === SUPER PADS LIGHTS CLONE ===

// Store key sounds and events
const pads = document.querySelectorAll(".pad");
const padVolumes = document.querySelectorAll(".pad-volume");
const audios = document.querySelectorAll("audio");

let recording = false;
let recordedSequence = [];
let startTime = 0;
let loopEnabled = false;
let playbackTimeouts = [];

// === Utility to play sound with per-pad volume ===
function playSound(key) {
  const audio = document.querySelector(`audio[data-key="${key}"]`);
  const pad = document.querySelector(`.pad[data-key="${key}"]`);
  const padContainer = pad?.parentElement;
  const volumeSlider = padContainer?.querySelector(".pad-volume");

  if (!audio || !pad) return;

  // Reset and set volume
  audio.currentTime = 0;
  audio.volume = volumeSlider ? volumeSlider.value : 1;
  audio.play();

  // Visual glow
  pad.classList.add("active");
  setTimeout(() => pad.classList.remove("active"), 150);

  // If recording, push to recordedSequence
  if (recording) {
    const time = Date.now() - startTime;
    recordedSequence.push({ key, time, volume: audio.volume });
  }
}

// === Event Listeners for pads ===
pads.forEach((pad) => {
  pad.addEventListener("click", () => {
    const key = pad.getAttribute("data-key");
    playSound(key);
  });
});

// === Keyboard controls ===
window.addEventListener("keydown", (e) => {
  const key = e.key.toUpperCase();
  if (document.querySelector(`.pad[data-key="${key}"]`)) {
    playSound(key);
  }
});

// === Record ===
document.querySelector(".record").addEventListener("click", () => {
  recordedSequence = [];
  recording = true;
  startTime = Date.now();
  console.log("Recording started");
});

// === Stop ===
document.querySelector(".stop").addEventListener("click", () => {
  recording = false;
  loopEnabled = false;
  playbackTimeouts.forEach(clearTimeout);
  console.log("Stopped");
});

// === Play ===
document.querySelector(".play").addEventListener("click", () => {
  if (recordedSequence.length === 0) return;

  recording = false;
  playbackTimeouts.forEach(clearTimeout);

  recordedSequence.forEach((note) => {
    const timeout = setTimeout(() => {
      const audio = document.querySelector(`audio[data-key="${note.key}"]`);
      const pad = document.querySelector(`.pad[data-key="${note.key}"]`);
      if (audio) {
        audio.currentTime = 0;
        audio.volume = note.volume;
        audio.play();
      }
      if (pad) {
        pad.classList.add("active");
        setTimeout(() => pad.classList.remove("active"), 150);
      }
    }, note.time);
    playbackTimeouts.push(timeout);
  });

  // Loop if enabled
  if (loopEnabled) {
    const totalTime = recordedSequence[recordedSequence.length - 1].time;
    const loopTimeout = setTimeout(() => {
      document.querySelector(".play").click();
    }, totalTime + 500);
    playbackTimeouts.push(loopTimeout);
  }

  console.log("Playing sequence");
});

// === Clear ===
document.querySelector(".clear").addEventListener("click", () => {
  recordedSequence = [];
  recording = false;
  playbackTimeouts.forEach(clearTimeout);
  console.log("Sequence cleared");
});

// === Loop ===
document.querySelector(".loop").addEventListener("click", () => {
  loopEnabled = !loopEnabled;
  const loopBtn = document.querySelector(".loop");
  loopBtn.style.backgroundColor = loopEnabled ? "#00ff88" : "#ffcc00";
  console.log("Loop:", loopEnabled);
});
