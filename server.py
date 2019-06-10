import os.path
from flask import Flask, flash, redirect, render_template, request, session, abort
from flask_bootstrap import Bootstrap
from flask_api import status
from databaseControler import connect

app = Flask(__name__)
booststrap = Bootstrap(app)

@app.route("/")
def home():
    return render_template('home.html')

@app.route("/static/<path:path>")
def send_static(path):
    return send_from_directory('static', path)
            
@app.route("/games/<string:game>")
def games(game):
    if os.path.exists("templates/%s.html" %  game):
        return render_template("%s.html" % game)
    else:
        content = ('The game you are looking for does not seem to exist', 'consdied checking the url')
        return 'hello',  status.HTTP_404_NOT_FOUND

if __name__ == "__main__":
    connect()
    app.run()
