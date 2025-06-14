from flask import Flask, render_template, request
from datetime import datetime
import random

app = Flask(__name__)

emojis = ["🌈", "🚀", "🌟", "🎉", "🦄", "🧠", "🎵", "🎨", "✨"]

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
    return render_template("fancy.html", greeting=greeting, emoji=emoji, name=name)

if __name__ == '__main__':
    app.run(debug=True)
