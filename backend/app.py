from flask import Flask, request, jsonify, session, g
from flask_cors import CORS

app = Flask(__name__)

@app.route('/', methods = ["GET"])
def index():
    return "Server Working fine"

if __name__ == '__main__':
    app.run(debug=True, port=5000)