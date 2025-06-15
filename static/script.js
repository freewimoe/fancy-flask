// Fancy Flask Script.js

const gradients = [
  "linear-gradient(to right, #FFDEE9, #B5FFFC)",
  "linear-gradient(to right, #D5FFD0, #FDCB82)",
  "linear-gradient(to right, #C9FFBF, #FBD3E9)",
  "linear-gradient(to right, #A1C4FD, #C2FFD8)",
  "linear-gradient(to right, #f6d365, #fda085)",
  "linear-gradient(to right, #fbc2eb, #a6c1ee)"
];

const darkGradients = [
  "linear-gradient(to bottom, #0a0a0a, #1a1a1a)",
  "linear-gradient(to bottom, #111, #222, #333)",
  "linear-gradient(to bottom, #2b2b2b, #1f1f1f)",
  "linear-gradient(to bottom, #141e30, #243b55)"
];

const toggleThemeBtn = document.getElementById("toggleThemeBtn");
const colorBtn = document.getElementById("colorBtn");
const emojiToggleBtn = document.getElementById("emojiToggleBtn");
const trackSelect = document.getElementById("trackSelect");
const volume = document.getElementById("volume");
const muteBtn = document.getElementById("muteBtn");
const bgMusic = document.getElementById("bgMusic");
const quoteDisplay = document.getElementById("quoteDisplay");
const quoteForm = document.getElementById("quoteForm");
const emojiContainer = document.getElementById("emoji-rain");

let emojiRainOn = false;
let emojiInterval = null;
const emojis = ["🎶", "✨", "🎧", "🎵", "💫", "🎼", "🌟", "🪐", "🦄", "🌈", "🎊", "🌌", "🫧", "🕊️", "🐉", "🛸", "🧚", "🪽"];

function setTheme(theme) {
  document.body.dataset.theme = theme;
  localStorage.setItem("theme", theme);

  if (theme === "dark") {
    const g = darkGradients[Math.floor(Math.random() * darkGradients.length)];
    document.body.style.background = g;
    document.body.style.transition = "background 2s ease-in-out";

    // Immer den Mond einblenden
    const moon = document.createElement("div");
    moon.id = "moon-overlay";
    moon.style.position = "fixed";
    moon.style.top = "50%";
    moon.style.left = "50%";
    moon.style.transform = "translate(-50%, -50%)";
    moon.style.width = "75vmin";
    moon.style.height = "75vmin";
    moon.style.backgroundImage = "url('/static/moon.png')";
    moon.style.backgroundSize = "contain";
    moon.style.backgroundRepeat = "no-repeat";
    moon.style.backgroundPosition = "center";
    moon.style.zIndex = "0";
    moon.style.opacity = "0.6";
    moon.style.pointerEvents = "none";
    moon.style.transition = "opacity 2s ease-in-out";
    if (!document.getElementById("moon-overlay")) {
      document.body.appendChild(moon);
    }
  } else {
    const savedGradient = localStorage.getItem("gradient") || gradients[0];
    document.body.style.background = savedGradient;
    document.body.style.backgroundImage = "none";
    const moon = document.getElementById("moon-overlay");
    if (moon) moon.remove();
  }
}

function applyGradient(g) {
  if (document.body.dataset.theme === "light") {
    document.body.style.background = g;
    localStorage.setItem("gradient", g);
  } else {
    const gDark = darkGradients[Math.floor(Math.random() * darkGradients.length)];
    document.body.style.background = gDark;
    document.body.style.backgroundImage = "url('/static/moon.png')";
    document.body.style.backgroundSize = "75%";
    document.body.style.backgroundPosition = "center";
    document.body.style.backgroundRepeat = "no-repeat";
  }
}

function toggleEmojiRain() {
  emojiRainOn = !emojiRainOn;
  localStorage.setItem("emojiRainOn", emojiRainOn ? "true" : "false");
  emojiToggleBtn.textContent = emojiRainOn ? "🌧️ Emoji-Regen: AN" : "🌧️ Emoji-Regen: AUS";
  if (emojiRainOn) startEmojiRain(); else stopEmojiRain();
}

function startEmojiRain() {
  if (!emojiInterval) emojiInterval = setInterval(createEmoji, 300);
}

function stopEmojiRain() {
  clearInterval(emojiInterval);
  emojiInterval = null;
}

function createEmoji() {
  const emoji = document.createElement("div");
  emoji.classList.add("emoji");
  emoji.innerText = emojis[Math.floor(Math.random() * emojis.length)];
  emoji.style.left = Math.random() * 100 + "vw";
  emoji.style.animationDuration = (Math.random() * 2 + 3) + "s";
  emojiContainer.appendChild(emoji);
  setTimeout(() => emoji.remove(), 5000);
}

function loadQuotes() {
  fetch("/static/quotes.json")
    .then(res => res.json())
    .then(baseQuotes => {
      const saved = JSON.parse(localStorage.getItem("userQuotes") || "[]");
      const allQuotes = baseQuotes.concat(saved);
      function rotateQuotes() {
        quoteDisplay.style.opacity = 0;
        quoteDisplay.style.transition = "opacity 1.5s ease-in-out";
        setTimeout(() => {
          quoteDisplay.textContent = allQuotes[Math.floor(Math.random() * allQuotes.length)];
          quoteDisplay.style.opacity = 1;
        }, 500);
      }
      rotateQuotes();
      setInterval(rotateQuotes, 8000);
    })
    .catch(() => {
      quoteDisplay.textContent = "Zitat konnte nicht geladen werden.";
    });
}

// Initial setup
window.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme") || "light";
  setTheme(savedTheme);
  if (savedTheme === "light") {
    const savedGradient = localStorage.getItem("gradient") || gradients[0];
    applyGradient(savedGradient);
  }

  const savedTrack = localStorage.getItem("selectedTrack");
  const savedVolume = localStorage.getItem("volume");
  const savedMuted = localStorage.getItem("muted");

  if (bgMusic) {
    if (savedTrack) {
      bgMusic.src = `/static/${savedTrack}`;
      if (trackSelect) trackSelect.value = savedTrack;
    }
    if (savedVolume) {
      bgMusic.volume = savedVolume;
      volume.value = savedVolume;
    }
    if (savedMuted === "true") {
      bgMusic.muted = true;
      muteBtn.textContent = "🔈 Unmute";
    }

    bgMusic.play().catch(err => console.warn("Autoplay failed:", err));
  }

  if (localStorage.getItem("emojiRainOn") === "true") toggleEmojiRain();
  loadQuotes();
});

// Event Listeners
toggleThemeBtn?.addEventListener("click", () => {
  const current = document.body.dataset.theme || "light";
  setTheme(current === "light" ? "dark" : "light");
});

colorBtn?.addEventListener("click", () => {
  const g = document.body.dataset.theme === "dark"
    ? darkGradients[Math.floor(Math.random() * darkGradients.length)]
    : gradients[Math.floor(Math.random() * gradients.length)];
  applyGradient(g);
});

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
    volume.value = prev;
    muteBtn.textContent = "🔇 Mute";
  }
});

emojiToggleBtn?.addEventListener("click", toggleEmojiRain);

quoteForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  const input = document.getElementById("newQuote");
  const text = input.value.trim();
  if (text) {
    const saved = JSON.parse(localStorage.getItem("userQuotes") || "[]");
    saved.push(text);
    localStorage.setItem("userQuotes", JSON.stringify(saved));
    input.value = "";
    alert("Zitat hinzugefügt!");
  }
});
