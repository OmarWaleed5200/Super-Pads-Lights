const pads = document.querySelectorAll(".pad");
const keyMap = {
  q: "kick", w: "snare", e: "hihat", r: "clap",
  a: "tom", s: "crash", d: "perc1", f: "perc2",
  z: "bass", x: "chord1", c: "chord2", v: "chord3",
  "1": "fx1", "2": "fx2", "3": "fx3", "4": "fx4"
};

// --- Recording state ---
let isRecording = false;
let startTime = 0;
let recordedNotes = [];

// --- Controls ---
const recordBtn = document.getElementById("recordBtn");
const stopBtn   = document.getElementById("stopBtn");
const playBtn   = document.getElementById("playBtn");
const clearBtn  = document.getElementById("clearBtn");

function triggerPad(pad, sound) {
  if (!pad) return;

  const audio = new Audio(`sounds/${sound}.mp3`);
  audio.play();

  pad.classList.add("active");
  setTimeout(() => pad.classList.remove("active"), 200);

  // Save note if recording
  if (isRecording) {
    const time = Date.now() - startTime;
    recordedNotes.push({ sound, time });
  }
}

// Mouse clicks
pads.forEach(pad => {
  pad.addEventListener("click", () => {
    triggerPad(pad, pad.dataset.sound);
  });
});

// Keyboard
document.addEventListener("keydown", (event) => {
  const sound = keyMap[event.key.toLowerCase()];
  if (sound) {
    const pad = document.querySelector(`.pad[data-sound="${sound}"]`);
    triggerPad(pad, sound);
  }
});

// --- Recording ---
recordBtn.addEventListener("click", () => {
  recordedNotes = [];
  startTime = Date.now();
  isRecording = true;

  recordBtn.disabled = true;
  stopBtn.disabled = false;
  playBtn.disabled = true;
  clearBtn.disabled = true;
});

stopBtn.addEventListener("click", () => {
  isRecording = false;

  recordBtn.disabled = false;
  stopBtn.disabled = true;
  playBtn.disabled = recordedNotes.length === 0;
  clearBtn.disabled = recordedNotes.length === 0;
});

// --- Playback ---
playBtn.addEventListener("click", () => {
  if (recordedNotes.length === 0) return;

  recordedNotes.forEach(note => {
    setTimeout(() => {
      const pad = document.querySelector(`.pad[data-sound="${note.sound}"]`);
      triggerPad(pad, note.sound);
    }, note.time);
  });
});

// --- Clear ---
clearBtn.addEventListener("click", () => {
  recordedNotes = [];
  playBtn.disabled = true;
  clearBtn.disabled = true;
});
