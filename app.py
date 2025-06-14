from flask import Flask, render_template, request, jsonify
from datetime import datetime
import random
import json
import os

app = Flask(__name__)

COUNTER_FILE = "visitor_count.json"

def increment_visitor_count():
    if not os.path.exists(COUNTER_FILE):
        with open(COUNTER_FILE, "w") as f:
            json.dump({"count": 1}, f)
        return 1

    with open(COUNTER_FILE, "r") as f:
        data = json.load(f)

    data["count"] += 1

    with open(COUNTER_FILE, "w") as f:
        json.dump(data, f)

    return data["count"]

@app.route("/")
def home():
    count = increment_visitor_count()
    return render_template("fancy.html", visitor_count=count)

@app.route("/counter")
def get_counter():
    with open(COUNTER_FILE, "r") as f:
        data = json.load(f)
    return jsonify(data)
