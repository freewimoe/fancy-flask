// Variablen aus Jinja-Template in HTML gesetzt:
// const userName = "...";
// const visitorCount = "...";

const quoteDisplay = document.getElementById("quoteDisplay");
let userQuotes = [];
let allQuotes = [];

async function loadQuotes() {
  try {
    const response = await fetch("/static/quotes.json");
    const baseQuotes = await response.json();
    const savedUserQuotes = localStorage.getItem("userQuotes");
    if (savedUserQuotes) userQuotes = JSON.parse(savedUserQuotes);
    allQuotes = baseQuotes.concat(userQuotes);

    function rotateQuotes() {
      quoteDisplay.style.opacity = 0;
      setTimeout(() => {
        const index = Math.floor(Math.random() * allQuotes.length);
        quoteDisplay.textContent = allQuotes[index];
        quoteDisplay.style.opacity = 1;
      }, 500);
    }

    rotateQuotes();
    setInterval(rotateQuotes, 8000);
  } catch (err) {
    quoteDisplay.textContent = "Zitat konnte nicht geladen werden.";
    console.error(err);
  }
}

if (userName) loadQuotes();

window.addEventListener("DOMContentLoaded", () => {
  const bgMusic = document.getElementById("bgMusic");
  if (bgMusic && userName) {
    bgMusic.play().catch(err => console.log("Autoplay prevented:", err));
  }
});

const toggleThemeBtn = document.getElementById("toggleThemeBtn");
function setTheme(theme) {
  document.body.dataset.theme = theme;
  localStorage.setItem("theme", theme);
}
toggleThemeBtn?.addEventListener("click", () => {
  const current = document.body.dataset.theme || "light";
  setTheme(current === "light" ? "dark" : "light");
});
const savedTheme = localStorage.getItem("theme") || "light";
setTheme(savedTheme);

const colorBtn = document.getElementById("colorBtn");
const gradients = [
  "linear-gradient(to right, #FFDEE9, #B5FFFC)",
  "linear-gradient(to right, #D5FFD0, #FDCB82)",
  "linear-gradient(to right, #C9FFBF, #FBD3E9)",
  "linear-gradient(to right, #A1C4FD, #C2FFD8)"
];
function applyGradient(g) {
  document.body.style.background = g;
  localStorage.setItem("gradient", g);
}
colorBtn?.addEventListener("click", () => {
  const g = gradients[Math.floor(Math.random() * gradients.length)];
  applyGradient(g);
});
const savedGradient = localStorage.getItem("gradient");
if (savedGradient) applyGradient(savedGradient);

const bgMusic = document.getElementById('bgMusic');
const trackSelect = document.getElementById('trackSelect');
const volume = document.getElementById('volume');
const muteBtn = document.getElementById('muteBtn');

if (bgMusic) {
  trackSelect?.addEventListener('change', () => {
    const file = trackSelect.value;
    bgMusic.src = `/static/${file}`;
    localStorage.setItem("selectedTrack", file);
    bgMusic.play();
  });

  volume?.addEventListener('input', () => {
    bgMusic.volume = volume.value;
    localStorage.setItem("volume", volume.value);
  });

  muteBtn?.addEventListener('click', () => {
    bgMusic.muted = !bgMusic.muted;
    muteBtn.textContent = bgMusic.muted ? '🔈 Unmute' : '🔇 Mute';
    localStorage.setItem("muted", bgMusic.muted ? "true" : "false");
  });

  const savedTrack = localStorage.getItem("selectedTrack");
  if (savedTrack) {
    bgMusic.src = `/static/${savedTrack}`;
    if (trackSelect) trackSelect.value = savedTrack;
  }
  const savedVolume = localStorage.getItem("volume");
  if (savedVolume) {
    volume.value = savedVolume;
    bgMusic.volume = savedVolume;
  }
  const savedMuted = localStorage.getItem("muted");
  if (savedMuted === "true") {
    bgMusic.muted = true;
    muteBtn.textContent = "🔈 Unmute";
  }
}

const emojis = ["🎶", "✨", "🎧", "🎵", "💫", "🎼", "🌟", "🪐"];
const emojiContainer = document.getElementById("emoji-rain");
const emojiToggleBtn = document.getElementById("emojiToggleBtn");
let emojiRainOn = false;
let emojiInterval = null;

function createEmoji() {
  const emoji = document.createElement("div");
  emoji.classList.add("emoji");
  emoji.innerText = emojis[Math.floor(Math.random() * emojis.length)];
  emoji.style.left = Math.random() * 100 + "vw";
  emoji.style.animationDuration = (Math.random() * 2 + 3) + "s";
  emojiContainer.appendChild(emoji);
  setTimeout(() => emoji.remove(), 5000);
}

function startEmojiRain() {
  if (!emojiInterval) emojiInterval = setInterval(createEmoji, 300);
}

function stopEmojiRain() {
  clearInterval(emojiInterval);
  emojiInterval = null;
}

function toggleEmojiRain() {
  emojiRainOn = !emojiRainOn;
  localStorage.setItem("emojiRainOn", emojiRainOn ? "true" : "false");
  emojiToggleBtn.textContent = emojiRainOn ? "🌧️ Emoji-Regen: AN" : "🌧️ Emoji-Regen: AUS";
  if (emojiRainOn) startEmojiRain(); else stopEmojiRain();
}

emojiToggleBtn?.addEventListener("click", toggleEmojiRain);
if (localStorage.getItem("emojiRainOn") === "true") toggleEmojiRain();

const quoteForm = document.getElementById("quoteForm");
quoteForm?.addEventListener("submit", function (e) {
  e.preventDefault();
  const input = document.getElementById("newQuote");
  const text = input.value.trim();
  if (text) {
    allQuotes.push(text);
    userQuotes.push(text);
    localStorage.setItem("userQuotes", JSON.stringify(userQuotes));
    input.value = "";
    alert("Zitat hinzugefügt!");
  }
});
