from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return 'Hello, World 4!'

@app.route('/api/test')
def about():
    return jsonify({ "hello": "world" })
