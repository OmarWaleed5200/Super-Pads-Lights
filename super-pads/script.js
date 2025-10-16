const pads = document.querySelectorAll(".pad");
const recordButton = document.getElementById("record");
const stopButton = document.getElementById("stop");
const playButton = document.getElementById("play");
const clearButton = document.getElementById("clear");
const loopButton = document.getElementById("loop");

let isRecording = false;
let isLooping = false;
let startTime;
let recordedNotes = [];
let loopInterval;

// 🥁 Key-to-sound map
const padSounds = {
  Q: "sounds/kick.wav",
  W: "sounds/snare.wav",
  E: "sounds/hihat.wav",
  R: "sounds/clap.wav",
  A: "sounds/tom1.wav",
  S: "sounds/tom2.wav",
  D: "sounds/tom3.wav",
  F: "sounds/crash.wav",
  Z: "sounds/openhat.wav",
  X: "sounds/perc.wav",
  C: "sounds/shaker.wav",
  V: "sounds/rim.wav",
  "1": "sounds/bass.wav",
  "2": "sounds/synth1.wav",
  "3": "sounds/synth2.wav",
  "4": "sounds/vocal.wav"
};

// 🎵 Play pad sound
function playPad(pad) {
  const key = pad.dataset.key.toUpperCase();
  const soundPath = padSounds[key];
  if (!soundPath) return;

  const sound = new Audio(soundPath);
  const volumeSlider = pad.querySelector(".volume-slider");
  if (volumeSlider) sound.volume = parseFloat(volumeSlider.value);

  sound.currentTime = 0;
  sound.play();

  // Add glowing pulse animation
  pad.classList.add("active", "pulsing");

  // Record note if recording
  if (isRecording) {
    const time = Date.now() - startTime;
    recordedNotes.push({ key, time, volume: sound.volume });
  }
}

// 💡 Stop glow when key released
function stopGlow(pad) {
  pad.classList.remove("pulsing", "active");
}

// 🧠 Handle key press and release
document.addEventListener("keydown", e => {
  const key = e.key.toUpperCase();
  const pad = document.querySelector(`.pad[data-key="${key}"]`);
  if (pad && !pad.classList.contains("active")) playPad(pad);
});

document.addEventListener("keyup", e => {
  const key = e.key.toUpperCase();
  const pad = document.querySelector(`.pad[data-key="${key}"]`);
  if (pad) stopGlow(pad);
});

// 🖱️ Pad click
pads.forEach(pad => {
  pad.addEventListener("mousedown", () => playPad(pad));
  pad.addEventListener("mouseup", () => stopGlow(pad));
  pad.addEventListener("mouseleave", () => stopGlow(pad));
});

// 🔴 Record
recordButton.addEventListener("click", () => {
  recordedNotes = [];
  isRecording = true;
  startTime = Date.now();
  recordButton.classList.add("recording");
});

// ⏹ Stop
stopButton.addEventListener("click", () => {
  isRecording = false;
  recordButton.classList.remove("recording");
});

// ▶ Play
playButton.addEventListener("click", () => {
  if (recordedNotes.length === 0) return;

  recordedNotes.forEach(note => {
    setTimeout(() => {
      const pad = document.querySelector(`.pad[data-key="${note.key}"]`);
      if (pad) {
        const sound = new Audio(padSounds[note.key]);
        sound.volume = note.volume;
        sound.play();
        pad.classList.add("active");
        setTimeout(() => pad.classList.remove("active"), 200);
      }
    }, note.time);
  });

  if (isLooping) {
    const duration = recordedNotes[recordedNotes.length - 1].time;
    clearInterval(loopInterval);
    loopInterval = setInterval(() => playButton.click(), duration);
  }
});

// 🧹 Clear
clearButton.addEventListener("click", () => {
  recordedNotes = [];
  clearInterval(loopInterval);
});

// 🔁 Loop
loopButton.addEventListener("click", () => {
  isLooping = !isLooping;
  loopButton.classList.toggle("active", isLooping);
  if (!isLooping) clearInterval(loopInterval);
});
