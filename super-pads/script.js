// ===== Super Pads Lights Clone =====

const pads = document.querySelectorAll(".pad");
const recordBtn = document.getElementById("record");
const stopBtn = document.getElementById("stop");
const playBtn = document.getElementById("play");
const clearBtn = document.getElementById("clear");
const loopBtn = document.getElementById("loop");

let isRecording = false;
let isPlaying = false;
let isLooping = false;
let startTime = 0;
let recordedNotes = [];
let playTimeouts = [];

// Store active keys to prevent duplication
const activeKeys = new Set();

// ======= Pad Setup =======
pads.forEach(pad => {
  const key = pad.dataset.key.toUpperCase();
  const audio = new Audio(`sounds/${key}.mp3`);
  const volumeSlider = pad.querySelector(".volume");
  const glow = pad.querySelector(".glow");

  // Mouse click
  pad.addEventListener("click", () => triggerPad(key, pad, audio, volumeSlider, glow));

  // Keyboard press
  document.addEventListener("keydown", e => {
    if (e.repeat || activeKeys.has(e.key.toUpperCase())) return;
    if (e.key.toUpperCase() === key) {
      activeKeys.add(e.key.toUpperCase());
      triggerPad(key, pad, audio, volumeSlider, glow);
    }
  });

  // Release key to allow retrigger
  document.addEventListener("keyup", e => {
    activeKeys.delete(e.key.toUpperCase());
  });
});

// ======= Trigger Pad =======
function triggerPad(key, pad, audio, volumeSlider, glow) {
  const sound = new Audio(`sounds/${key}.mp3`);
  sound.volume = parseFloat(volumeSlider.value);
  sound.currentTime = 0;
  sound.play();

  // Glow flash
  glow.classList.add("active");
  pad.classList.add("flash");
  setTimeout(() => {
    glow.classList.remove("active");
    pad.classList.remove("flash");
  }, 250);

  // Record note
  if (isRecording) {
    const time = Date.now() - startTime;
    recordedNotes.push({ key, time, volume: sound.volume });
  }
}

// ======= Record =======
recordBtn.addEventListener("click", () => {
  recordedNotes = [];
  isRecording = true;
  startTime = Date.now();
  recordBtn.disabled = true;
  playBtn.disabled = true;
  loopBtn.disabled = true;
});

// ======= Stop =======
stopBtn.addEventListener("click", () => {
  if (isRecording) {
    isRecording = false;
    recordBtn.disabled = false;
    playBtn.disabled = false;
    loopBtn.disabled = false;
  }
  if (isPlaying) stopPlayback();
});

// ======= Play =======
playBtn.addEventListener("click", () => {
  if (recordedNotes.length === 0) return alert("No recording to play!");
  isPlaying = true;
  playSequence();
});

// ======= Loop =======
loopBtn.addEventListener("click", () => {
  if (recordedNotes.length === 0) return alert("No recording to loop!");
  isLooping = !isLooping;
  loopBtn.textContent = isLooping ? "Looping..." : "Loop";
  if (isLooping && !isPlaying) {
    isPlaying = true;
    playSequence();
  }
});

// ======= Clear =======
clearBtn.addEventListener("click", () => {
  recordedNotes = [];
  stopPlayback();
  isRecording = false;
  isPlaying = false;
  isLooping = false;
  loopBtn.textContent = "Loop";
});

// ======= Play Sequence =======
function playSequence() {
  if (recordedNotes.length === 0) return;

  startTime = Date.now();
  recordedNotes.forEach(note => {
    const timeout = setTimeout(() => {
      const pad = document.querySelector(`.pad[data-key="${note.key}"]`);
      const glow = pad.querySelector(".glow");
      const audio = new Audio(`sounds/${note.key}.mp3`);
      audio.volume = note.volume;
      audio.play();

      glow.classList.add("active");
      pad.classList.add("flash");
      setTimeout(() => {
        glow.classList.remove("active");
        pad.classList.remove("flash");
      }, 250);
    }, note.time);

    playTimeouts.push(timeout);
  });

  // Handle looping
  const totalDuration = recordedNotes[recordedNotes.length - 1].time;
  const endTimeout = setTimeout(() => {
    isPlaying = false;
    if (isLooping) playSequence();
  }, totalDuration + 500);
  playTimeouts.push(endTimeout);
}

// ======= Stop Playback =======
function stopPlayback() {
  playTimeouts.forEach(t => clearTimeout(t));
  playTimeouts = [];
  isPlaying = false;
}

