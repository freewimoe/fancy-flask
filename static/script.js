/* Fancy Flask Styles */

/* Fonts */
@import url('https://fonts.googleapis.com/css2?family=Comfortaa&family=Merriweather:wght@300;700&display=swap');

/* Grundlayout */
body {
  font-family: 'Comfortaa', cursive;
  margin: 0;
  padding: 0;
  color: #111;
  transition: background 1.5s ease-in-out, color 0.5s ease;
  min-height: 100vh;
  text-align: center;
  position: relative;
  z-index: 1;
}

body[data-theme="dark"] {
  color: #f5f5f5;
  font-family: 'Merriweather', serif;
  background-color: #000;
}

/* Überschrift */
h1 {
  font-size: 2.2rem;
  margin-top: 2rem;
  text-shadow: 2px 2px 6px rgba(0, 0, 0, 0.4);
}

p {
  margin: 0.5rem 0 1.5rem;
}

/* Steuerungsbereiche */
.audio-controls,
.button-bar {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1rem;
  margin: 1rem 0;
}

.audio-controls select,
.audio-controls input,
.button-bar button {
  font-size: 1rem;
  padding: 0.5rem 0.8rem;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
}

.button-bar button {
  background-color: #222;
  color: white;
}

body[data-theme="dark"] .button-bar button {
  background-color: #333;
  color: #eee;
}

body[data-theme="light"] .button-bar button {
  background-color: #000000cc;
  color: #fff;
}

/* Zitatanzeige mit Fading */
#quoteDisplay {
  font-style: italic;
  font-size: 1.4rem;
  margin: 2rem 1rem 1rem;
  transition: opacity 1.5s ease-in-out;
  text-shadow: 2px 2px 6px rgba(0, 0, 0, 0.3);
  opacity: 0;
}

body.loaded #quoteDisplay {
  opacity: 1;
}

/* Formular */
#quoteForm {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin: 1rem 0 3rem;
}

#newQuote {
  padding: 0.6rem;
  border-radius: 6px;
  border: 1px solid #aaa;
  width: 300px;
}

#quoteForm button {
  background-color: #2ecc71;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  color: white;
  font-weight: bold;
  cursor: pointer;
}

#quoteForm button:hover {
  background-color: #27ae60;
}

/* Emoji-Regen */
#emoji-rain {
  position: fixed;
  top: 0;
  left: 0;
  pointer-events: none;
  width: 100%;
  height: 100%;
  z-index: 5;
}

.emoji {
  position: absolute;
  top: -2rem;
  font-size: 2rem;
  animation: fallSnow 6s linear forwards;
  opacity: 0.8;
}

@keyframes fallSnow {
  0% {
    transform: translateY(-10%) rotate(0deg);
    opacity: 0.5;
  }
  50% {
    opacity: 1;
  }
  100% {
    transform: translateY(100vh) rotate(360deg);
    opacity: 0;
  }
}

/* Mond im Hintergrund */
#moon-overlay {
  position: fixed;
  bottom: 0;
  right: 0;
  width: 65vmin;
  height: 65vmin;
  background-image: url('/static/moon.png');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: bottom right;
  z-index: 0;
  opacity: 0.7;
  pointer-events: none;
  transition: opacity 2s ease-in-out;
}

/* Inhaltsebene */
main,
.audio-controls,
.button-bar,
#quoteBox,
#emoji-rain {
  position: relative;
  z-index: 10;
}
