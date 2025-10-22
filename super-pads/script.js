// Super Pads Lights Clone - With Volume Control
// by Omar + GPT-5

// Map each pad key to its sound file
const pads = {
  q: "kick.wav",
  w: "snare.wav",
  e: "clap.wav",
  r: "hat.wav",
  a: "bass.wav",
  s: "pad1.wav",
  d: "pad2.wav",
  f: "pad3.wav",
  z: "pad4.wav",
  x: "pad5.wav",
  c: "pad6.wav",
  v: "pad7.wav",
  "1": "pad8.wav",
  "2": "pad9.wav",
  "3": "pad10.wav",
  "4": "pad11.wav"
};

document.addEventListener("DOMContentLoaded", () => {
  const padElements = document.querySelectorAll(".pad");

  padElements.forEach(pad => {
    const key = pad.dataset.key;
    const slider = pad.querySelector("input[type='range']");
    const valueLabel = pad.querySelector("span");

    // Initialize volume display
    slider.addEventListener("input", () => {
      valueLabel.textContent = slider.value;
    });

    // Click to play sound
    pad.addEventListener("click", () => {
      playSound(key, slider.value);
      animatePad(pad);
    });
  });

  // Keyboard press to play sound
  document.addEventListener("keydown", e => {
    const key = e.key.toLowerCase();
    const pad = document.querySelector(`.pad[data-key="${key}"]`);
    if (pad && pads[key]) {
      const slider = pad.querySelector("input[type='range']");
      playSound(key, slider.value);
      animatePad(pad);
    }
  });
});

// Play sound from /sounds/ folder
function playSound(key, volume = 1) {
  const soundFile = pads[key];
  if (!soundFile) return;

  const audio = new Audio(`sounds/${soundFile}`);
  audio.volume = Math.min(Math.max(volume, 0), 2) / 2; // normalize (slider 0–2)
  audio.currentTime = 0;
  audio.play().catch(err => console.error(err));
}

// Add glow animation
function animatePad(pad) {
  pad.classList.add("active");
  setTimeout(() => pad.classList.remove("active"), 200);
}
