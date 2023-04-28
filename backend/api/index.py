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


MOCK_PIECES = [
    {
        "title": "The Dancing Bear",
        "period": "romantic",
        "author": "Thompson, John Sylvanus",
        "difficulty": {
            "x1": 0.09,
            "x2": 0.29
        },
        "id": "1b80e035-fd87-431d-b3bc-49998d2d4639"
    },
    {
        "title": "On the River Bank",
        "period": "early-2000th",
        "author": "Dunhill, Thomas",
        "difficulty": {
            "x1": 0.2,
            "x2": 0.27
        },
        "id": "aff32970-7e9b-4a8c-aff0-a0e23eb99fd5"
    },
    {
        "title": "Notebooks for Anna Magdalena Bach",
        "period": "early-2000th",
        "author": "Dunhill, Thomas",
        "difficulty": {
            "x1": 0.41,
            "x2": 0.39
        },
        "id": "90bead95-859c-47d0-a338-f9b0c3ea71b4"
    }
]
@app.route('/api/pieces')
def pieces():
    return jsonify({ 
        "_links": {},
        "array": MOCK_PIECES
    })
