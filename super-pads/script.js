// ==== CONFIGURATION ==== //
const padKeys = [
  'Q', 'W', 'E', 'R',
  'A', 'S', 'D', 'F',
  'Z', 'X', 'C', 'V',
  '1', '2', '3', '4'
];

// Optional: your pad sounds (update with your real .wav/.mp3 file names)
const padSounds = [
  'sounds/kick.wav', 'sounds/snare.wav', 'sounds/hihat.wav', 'sounds/clap.wav',
  'sounds/tom.wav', 'sounds/cowbell.wav', 'sounds/openhat.wav', 'sounds/shaker.wav',
  'sounds/bass.wav', 'sounds/chord.wav', 'sounds/vocal.wav', 'sounds/perc.wav',
  'sounds/synth1.wav', 'sounds/synth2.wav', 'sounds/fx1.wav', 'sounds/fx2.wav'
];

// Each pad gets its own glow color
const padColors = [
  '#00ffff', '#ff007f', '#ff6600', '#33ff00',
  '#ff0000', '#0099ff', '#ffcc00', '#9933ff',
  '#00ffcc', '#ff3399', '#66ff00', '#ff9900',
  '#33ccff', '#ff0066', '#99ff33', '#00ff66'
];

// ==== DOM SETUP ==== //
const padContainer = document.createElement('div');
padContainer.className = 'pad-grid';
document.body.appendChild(padContainer);

// Create pads dynamically
padKeys.forEach((key, index) => {
  const pad = document.createElement('div');
  pad.className = 'pad';
  pad.dataset.key = key.toLowerCase();
  pad.style.setProperty('--glow-color', padColors[index]);

  // Pad label
  const label = document.createElement('span');
  label.className = 'pad-label';
  label.textContent = key;
  pad.appendChild(label);

  // Volume slider
  const slider = document.createElement('input');
  slider.type = 'range';
  slider.min = 0;
  slider.max = 1;
  slider.step = 0.01;
  slider.value = 1;
  slider.className = 'volume-slider';
  pad.appendChild(slider);

  // Volume value
  const volValue = document.createElement('div');
  volValue.className = 'volume-value';
  volValue.textContent = '1';
  pad.appendChild(volValue);

  padContainer.appendChild(pad);
});

// ==== EVENT HANDLING ==== //
function playSound(key) {
  const padIndex = padKeys.indexOf(key.toUpperCase());
  if (padIndex === -1) return;

  const pad = document.querySelector(`.pad[data-key="${key.toLowerCase()}"]`);
  const volume = pad.querySelector('.volume-slider').value;

  const audio = new Audio(padSounds[padIndex]);
  audio.volume = volume;
  audio.play();

  // Animate pad glow
  pad.classList.add('active');
  setTimeout(() => pad.classList.remove('active'), 300);
}

document.addEventListener('keydown', (e) => playSound(e.key));
document.querySelectorAll('.pad').forEach((pad) => {
  pad.addEventListener('click', () => playSound(pad.dataset.key));
});

// Update volume label
document.querySelectorAll('.volume-slider').forEach((slider) => {
  slider.addEventListener('input', (e) => {
    e.target.nextElementSibling.textContent = e.target.value;
  });
});

// ==== BUTTONS (Optional Placeholder Logic) ==== //
document.getElementById('recordBtn').addEventListener('click', () => alert('Recording...'));
document.getElementById('stopBtn').addEventListener('click', () => alert('Stopped'));
document.getElementById('playBtn').addEventListener('click', () => alert('Playing...'));
document.getElementById('clearBtn').addEventListener('click', () => alert('Cleared'));
document.getElementById('loopBtn').addEventListener('click', () => alert('Looping...'));
