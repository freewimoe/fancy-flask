// Wichtige DOM-Elemente referenzieren
const startScreen = document.getElementById("startScreen");
const mainContent = document.getElementById("mainContent");
const nameInput = document.getElementById("nameInput");
const startBtn = document.getElementById("startBtn");
const quoteDisplay = document.getElementById("quoteDisplay");
const emojiContainer = document.getElementById("emoji-rain");
const emojiToggleBtn = document.getElementById("emojiToggleBtn");
const bgMusic = document.getElementById("bgMusic");
const trackSelect = document.getElementById("trackSelect");
const volume = document.getElementById("volume");
const muteBtn = document.getElementById("muteBtn");

// Name-Handling
if (startBtn) {
  startBtn.addEventListener("click", () => {
    const name = nameInput.value.trim();
    if (name) {
      const form = document.createElement("form");
      form.method = "POST";
      form.style.display = "none";
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = "name";
      input.value = name;
      form.appendChild(input);
      document.body.appendChild(form);
      form.submit();
    }
  });
}

// Dark Mode mit Mond & Fog
const toggleThemeBtn = document.getElementById("toggleThemeBtn");
function setTheme(theme) {
  document.body.dataset.theme = theme;
  localStorage.setItem("theme", theme);
  if (theme === "dark") {
    if (!document.getElementById("fog-layer")) {
      const fog = document.createElement("div");
      fog.id = "fog-layer";
      document.body.appendChild(fog);
    }
  } else {
    const fog = document.getElementById("fog-layer");
    if (fog) fog.remove();
  }
}
toggleThemeBtn?.addEventListener("click", () => {
  const current = document.body.dataset.theme || "light";
  setTheme(current === "light" ? "dark" : "light");
});
setTheme(localStorage.getItem("theme") || "light");

// Emoji Regen
const emojis = [
  "🎶", "✨", "🎧", "🎵", "💫", "🎼", "🌟", "🪐",
  "🦄", "🌈", "🎊", "🌌", "🫧", "🕊️", "🐉", "🛸", "🧚", "🪽"
];
let emojiRainOn = false;
let emojiInterval = null;
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
  emojiRainOn ? startEmojiRain() : stopEmojiRain();
}
emojiToggleBtn?.addEventListener("click", toggleEmojiRain);
if (localStorage.getItem("emojiRainOn") === "true") toggleEmojiRain();

// Quotes laden
let userQuotes = [];
let allQuotes = [];
async function loadQuotes() {
  try {
    const res = await fetch("/static/quotes.json");
    const baseQuotes = await res.json();
    const savedUserQuotes = localStorage.getItem("userQuotes");
    if (savedUserQuotes) userQuotes = JSON.parse(savedUserQuotes);
    allQuotes = baseQuotes.concat(userQuotes);
    function rotateQuotes() {
      quoteDisplay.style.opacity = 0;
      setTimeout(() => {
        quoteDisplay.textContent = allQuotes[Math.floor(Math.random() * allQuotes.length)];
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
loadQuotes();

document.getElementById("quoteForm")?.addEventListener("submit", (e) => {
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

// Musiksteuerung
if (bgMusic) {
  const savedTrack = localStorage.getItem("selectedTrack");
  if (savedTrack) {
    bgMusic.src = `/static/${savedTrack}`;
    if (trackSelect) trackSelect.value = savedTrack;
  } else {
    bgMusic.src = `/static/Lowtone Music - Chill Calm.mp3`;
  }

  const savedVolume = localStorage.getItem("volume");
  if (savedVolume) {
    volume.value = savedVolume;
    bgMusic.volume = savedVolume;
  }

  const savedMuted = localStorage.getItem("muted");
  if (savedMuted === "true") {
    bgMusic.volume = 0;
    muteBtn.textContent = "🔈 Unmute";
  }

  bgMusic.play().catch(err => console.warn("Autoplay prevented:", err));

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
