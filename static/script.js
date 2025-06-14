// Globale Konstanten
const emojiToggleBtn = document.getElementById("emojiToggleBtn");
const trackSelect = document.getElementById("trackSelect");
const volume = document.getElementById("volume");
const muteBtn = document.getElementById("muteBtn");
const toggleThemeBtn = document.getElementById("toggleThemeBtn");
const colorBtn = document.getElementById("colorBtn");
const bgMusic = document.getElementById("bgMusic");
const quoteDisplay = document.getElementById("quoteDisplay");
const quoteForm = document.getElementById("quoteForm");
const emojiContainer = document.getElementById("emoji-rain");

let emojiRainOn = false;
let emojiInterval = null;
let userQuotes = [];
let allQuotes = [];

const emojis = [
  "🎶", "✨", "🎧", "🎵", "💫", "🎼", "🌟", "🪐",
  "🦄", "🌈", "🎊", "🌌", "🫧", "🕊️", "🐉", "🛸", "🧚", "🪽"
];

const gradients = [
  "linear-gradient(to right, #FFDEE9, #B5FFFC)",
  "linear-gradient(to right, #D5FFD0, #FDCB82)",
  "linear-gradient(to right, #C9FFBF, #FBD3E9)",
  "linear-gradient(to right, #A1C4FD, #C2FFD8)"
];

// Emoji-Regen
function createEmoji() {
  const emoji = document.createElement("div");
  emoji.classList.add("emoji");
  emoji.innerText = emojis[Math.floor(Math.random() * emojis.length)];
  emoji.style.left = Math.random() * 100 + "vw";
  emoji.style.animationDuration = (Math.random() * 2 + 3) + "s";
  emojiContainer.appendChild(emoji);
  setTimeout(() => emoji.remove(), 6000);
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

// Zitate
async function loadQuotes() {
  try {
    const response = await fetch("/static/quotes.json");
    const baseQuotes = await response.json();
    const savedUserQuotes = localStorage.getItem("userQuotes");
    if (savedUserQuotes) userQuotes = JSON.parse(savedUserQuotes);
    allQuotes = baseQuotes.concat(userQuotes);

    function rotateQuotes() {
      if (!quoteDisplay) return;
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
    if (quoteDisplay) quoteDisplay.textContent = "Zitat konnte nicht geladen werden.";
    console.error(err);
  }
}

// Theme & Farben
function setTheme(theme) {
  document.body.dataset.theme = theme;
  localStorage.setItem("theme", theme);

  if (theme === "dark") {
    document.body.style.background = "linear-gradient(to bottom, #050505, #101010, #1b1b1b)";
    document.body.style.backgroundImage = "url('/static/moon.png')";
    document.body.style.backgroundSize = "75%";
    document.body.style.backgroundPosition = "center center";
    document.body.style.backgroundRepeat = "no-repeat";
  } else {
    const savedGradient = localStorage.getItem("gradient") || gradients[0];
    document.body.style.background = savedGradient;
    document.body.style.backgroundImage = "none";
  }
}

function applyGradient(g) {
  document.body.style.background = g;
  localStorage.setItem("gradient", g);
}

// Musiksteuerung
function setupMusicControls() {
  const savedTrack = localStorage.getItem("selectedTrack");
  if (savedTrack && bgMusic) {
    bgMusic.src = `/static/${savedTrack}`;
    trackSelect.value = savedTrack;
  }
  const savedVolume = localStorage.getItem("volume");
  if (savedVolume && bgMusic) {
    volume.value = savedVolume;
    bgMusic.volume = savedVolume;
  }
  if (localStorage.getItem("muted") === "true" && bgMusic) {
    bgMusic.volume = 0;
    muteBtn.textContent = "🔈 Unmute";
  }

  trackSelect?.addEventListener("change", () => {
    const file = trackSelect.value;
    bgMusic.src = `/static/${file}`;
    localStorage.setItem("selectedTrack", file);
    bgMusic.play();
  });

  volume?.addEventListener("input", () => {
    bgMusic.volume = volume.value;
    localStorage.setItem("volume", volume.value);
  });

  muteBtn?.addEventListener("click", () => {
    if (bgMusic.volume > 0) {
      localStorage.setItem("prevVolume", bgMusic.volume);
      bgMusic.volume = 0;
      muteBtn.textContent = "🔈 Unmute";
    } else {
      const prev = localStorage.getItem("prevVolume") || 0.5;
      bgMusic.volume = prev;
      muteBtn.textContent = "🔇 Mute";
    }
  });
}

// Eventlistener
window.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("emojiRainOn") === "true") toggleEmojiRain();
  const savedTheme = localStorage.getItem("theme") || "light";
  setTheme(savedTheme);

  const savedGradient = localStorage.getItem("gradient");
  if (savedTheme !== "dark" && savedGradient) applyGradient(savedGradient);

  setupMusicControls();
  loadQuotes();
});

// Button Events
toggleThemeBtn?.addEventListener("click", () => {
  const current = document.body.dataset.theme || "light";
  setTheme(current === "light" ? "dark" : "light");
});

colorBtn?.addEventListener("click", () => {
  if (document.body.dataset.theme === "dark") return;
  const g = gradients[Math.floor(Math.random() * gradients.length)];
  applyGradient(g);
});

emojiToggleBtn?.addEventListener("click", toggleEmojiRain);

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