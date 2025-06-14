# app.py
from flask import Flask, render_template, request
from datetime import datetime
import random

app = Flask(__name__)

emojis = ["🌈", "🚀", "🌟", "🎉", "🦄", "🧠", "🎵", "🎨", "✨"]
quotes = [
    "Der Weg ist das Ziel.",
    "Verweile nicht in der Vergangenheit, träume nicht von der Zukunft, konzentriere dich auf den gegenwärtigen Moment.",
    "Glaube an Wunder, Liebe und Glück!"
]

@app.route('/', methods=['GET', 'POST'])
def home():
    name = request.form.get("name", "")
    hour = datetime.now().hour
    greeting = (
        "Guten Morgen ☀️" if hour < 12 else
        "Guten Tag 🌤️" if hour < 18 else
        "Guten Abend 🌙"
    )
    emoji = random.choice(emojis)
    quote = random.choice(quotes)
    return render_template("fancy.html", greeting=greeting, emoji=emoji, name=name, quote=quote)

if __name__ == '__main__':
    app.run(debug=True)