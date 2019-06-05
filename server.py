from flask import Flask, flash, redirect, render_template, request, session, abort
from flask_bootstrap import Bootstrap
from databaseControler import connect

app = Flask(__name__)
booststrap = Bootstrap(app)

@app.route("/")
def home():
    return render_template('home.html')

@app.route("/static/<path:path>")
def send_static(path):
    return send_from_directory('static', path)
            

if __name__ == "__main__":
    connect()
    app.run()
