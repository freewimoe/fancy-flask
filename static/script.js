// static/script.js

// Uhr aktualisieren
function updateClock() {
    const now = new Date();
    document.getElementById('clock').textContent = now.toLocaleTimeString();
}
setInterval(updateClock, 1000);
updateClock();

// Farbwechsel
function changeGradient() {
    const colors = [
        ["#fbd3e9", "#bbd0ff"],
        ["#FFDEE9", "#B5FFFC"],
        ["#C9FFBF", "#FBD3E9"],
        ["#FF9A9E", "#A1C4FD"],
    ];
    const selected = colors[Math.floor(Math.random() * colors.length)];
    document.body.style.background = `linear-gradient(to right, ${selected[0]}, ${selected[1]})`;
}

// Audio-Steuerung
const audio = document.getElementById('bgm');
const volumeSlider = document.getElementById('volume');
const muteBtn = document.getElementById('muteBtn');
const trackSelect = document.getElementById('trackSelect');

volumeSlider.addEventListener('input', () => {
    audio.volume = volumeSlider.value;
});

muteBtn.addEventListener('click', () => {
    audio.muted = !audio.muted;
    muteBtn.textContent = audio.muted ? '🔈 Unmute' : '🔇 Mute';
});

trackSelect.addEventListener('change', () => {
    audio.src = `/static/${trackSelect.value}`;
    audio.play();
});

// Emoji-Regen (Canvas)
const canvas = document.getElementById("emojiRain");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const emojis = ["🎉", "✨", "🌈", "🦄", "🎶"];
let particles = [];

function createParticle() {
    const emoji = emojis[Math.floor(Math.random() * emojis.length)];
    particles.push({
        x: Math.random() * canvas.width,
        y: -20,
        speedY: 2 + Math.random() * 3,
        text: emoji,
        size: 24 + Math.random() * 16
    });
}

function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p, i) => {
        ctx.font = `${p.size}px serif`;
        ctx.fillText(p.text, p.x, p.y);
        p.y += p.speedY;
        if (p.y > canvas.height) particles.splice(i, 1);
    });
    requestAnimationFrame(drawParticles);
}

setInterval(createParticle, 300);
drawParticles();
