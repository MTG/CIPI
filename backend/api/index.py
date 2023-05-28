from flask import Flask, jsonify
from flask_cors import CORS
import os
import sys
from .pieces import get_pieces 




app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return 'Hello, World 4!'

@app.route('/api/test')
def about():
    return jsonify({ "hello": "world" })


@app.route('/api/pieces')
def pieces():
    return jsonify({ 
       "_links": {},
        "array": get_pieces()
    })