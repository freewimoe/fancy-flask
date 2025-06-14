// userName aus localStorage lesen, um Kompatibilität mit Startscreen zu sichern
const userName = localStorage.getItem("userName");

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

window.addEventListener("DOMContentLoaded", () => {
  const startScreen = document.getElementById("startScreen");
  const mainContent = document.getElementById("mainContent");
  const nameInput = document.getElementById("nameInput");
  const startBtn = document.getElementById("startBtn");

  if (!userName && startScreen && mainContent) {
    startScreen.style.display = "flex";
    mainContent.style.display = "none";
    startBtn?.addEventListener("click", () => {
      const name = nameInput.value.trim();
      if (name) {
        localStorage.setItem("userName", name);
        startScreen.style.display = "none";
        mainContent.style.display = "block";
        loadQuotes();
        bgMusic?.play().catch(err => console.warn("Music start failed:", err));
      }
    });
  } else {
    if (startScreen) startScreen.style.display = "none";
    if (mainContent) mainContent.style.display = "block";
    loadQuotes();
    bgMusic?.play().catch(err => console.warn("Music start failed:", err));
  }
});

const toggleThemeBtn = document.getElementById("toggleThemeBtn");
function setTheme(theme) {
  document.body.dataset.theme = theme;
  localStorage.setItem("theme", theme);

  if (theme === "dark") {
    document.body.style.background = "linear-gradient(to bottom, #0f2027, #203a43, #2c5364)";
    document.body.style.backgroundImage = "url('/static/moon.png')";
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.backgroundPosition = "center center";
    document.body.style.backgroundSize = "75%";
    let fog = document.getElementById("fog-layer");
    if (!fog) {
      fog = document.createElement("div");
      fog.id = "fog-layer";
      fog.style.background = "url('/static/Foggy_1.png'), url('/static/Foggy_2.png')";
      fog.style.backgroundSize = "200% 100%, 300% 100%";
      fog.style.animation = "fogAnim 60s linear infinite";
      fog.style.opacity = "0.2";
      fog.style.position = "fixed";
      fog.style.top = "0";
      fog.style.left = "0";
      fog.style.width = "100%";
      fog.style.height = "100%";
      fog.style.pointerEvents = "none";
      fog.style.zIndex = "2";
      document.body.appendChild(fog);
    }
  } else {
    const savedGradient = localStorage.getItem("gradient") || "linear-gradient(to right, #FFDEE9, #B5FFFC)";
    document.body.style.background = savedGradient;
    document.body.style.backgroundImage = "none";
    const fog = document.getElementById("fog-layer");
    if (fog) fog.remove();
  }
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
  if (document.body.dataset.theme !== "dark") {
    document.body.style.background = g;
    localStorage.setItem("gradient", g);
  }
}
colorBtn?.addEventListener("click", () => {
  const g = gradients[Math.floor(Math.random() * gradients.length)];
  applyGradient(g);
});
if (savedTheme !== "dark") {
  const savedGradient = localStorage.getItem("gradient");
  if (savedGradient) applyGradient(savedGradient);
}

const bgMusic = document.getElementById('bgMusic');
const trackSelect = document.getElementById('trackSelect');
const volume = document.getElementById('volume');
const muteBtn = document.getElementById('muteBtn');

if (bgMusic) {
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

  bgMusic.play().catch(err => console.warn("Initial play failed:", err));

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

const emojis = [
  "🎶", "✨", "🎧", "🎵", "💫", "🎼", "🌟", "🪐",
  "🦄", "🌈", "🎊", "🌌", "🫧", "🕊️", "🐉", "🛸", "🧚", "🪽"
];
const emojiContainer = document.getElementById("emoji-rain");
const emojiToggleBtn = document.getElementById("emojiToggleBtn");
let emojiRainOn = false;
let emojiInterval = null;

function createEmoji() {
  const emoji = document.createElement("div");
  emoji.classList.add("emoji");
  emoji.innerText = emojis[Math.floor(Math.random() * emojis.length)];
  emoji.style.left = Math.random() * 100 + "vw";
  emoji.style.animationDuration = (Math.random() * 4 + 4) + "s";
  emojiContainer.appendChild(emoji);
  setTimeout(() => emoji.remove(), 8000);
}

function startEmojiRain() {
  if (!emojiInterval) emojiInterval = setInterval(createEmoji, 400);
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
