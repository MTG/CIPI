from flask import Flask, jsonify, request
from flask_cors import CORS
from .login import with_login
import os
from dotenv import load_dotenv
import sys
from .repository.pieces import get_pieces 


load_dotenv(".env.development" if os.environ.get('ENV', None) == 'dev' else ".env.production")
load_dotenv(".env")

app = Flask(__name__)
CORS(app)


@app.route('/')
def home():
    return 'Hello, World 4!'

@app.get('/api/pieces')
def pieces():
    args = request.args
    size=int(args.get("size"))
    page=int(args.get("page"))
    period=args.get("period")
    min_difficulty=args.get("min_difficulty")
    max_difficulty=args.get("max_difficulty")
    input_string=args.get("input_string")
    pieces, pages_count = get_pieces(size, page, period, min_difficulty, max_difficulty, input_string)
    return jsonify({ 
         "_links": {
            "total_pages": pages_count
        },
        "array": pieces
    })



@app.get('/api/demoAuth')  # only for demostration purposes
@with_login
def demo_auth(user):
    print(user)
    return jsonify({ 
        "some": "data",
        "user": user
    })
