from flask import Flask, render_template, request
import os

app = Flask(__name__)
VISITOR_FILE = "visitor_count.txt"

def get_visitor_count():
    if not os.path.exists(VISITOR_FILE):
        with open(VISITOR_FILE, "w") as f:
            f.write("0")
    with open(VISITOR_FILE, "r+") as f:
        count = int(f.read().strip())
        count += 1
        f.seek(0)
        f.write(str(count))
        f.truncate()
    return count

@app.route("/", methods=["GET", "POST"])
def index():
    name = None
    if request.method == "POST":
        name = request.form.get("name")
        visitor_count = get_visitor_count()
        return render_template("index.html", name=name, visitor_count=visitor_count)
    return render_template("index.html", name=None, visitor_count=0)

if __name__ == "__main__":
    app.run(debug=True)
