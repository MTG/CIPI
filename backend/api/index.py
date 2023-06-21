from flask import Flask, jsonify, request
from flask_cors import CORS

from backend.api._repository.user import insert_user_data
from ._auth.login import with_login
import os
from dotenv import load_dotenv
from ._repository.pieces import get_pieces, get_pieces_id
from ._clients.pdf_difficulty_service import get_difficulty
from ._repository.neighbors import get_neighbors_piece, get_neighbors_piece_difficulty

load_dotenv(".env.development" if os.environ.get('ENV', None) == 'dev' else ".env.production")
load_dotenv(".env")

app = Flask(__name__)
CORS(app)


@app.route('/')
def home():
    return 'Hello, World 4!'


@app.get('/api/pieces')
def pieces():
    return jsonify({ 
       "_links": {},
        "array": get_pieces()
    })


@app.post('/api/pieces')
@with_login
def new_piece(user):
    print(f"{user.email} uploaded a file")
    score_file = request.files.get('score')
    difficulty = get_difficulty(score_file)
    return jsonify({ 
        "data": {
            "difficulty": difficulty,
            "pieces": get_neighbors_piece_difficulty(difficulty)  # 13 closest pieces by difficulty
        }
    })


@app.post('/auth')
@with_login
def auth(user):
    return jsonify({
        "user": user
    })


@app.post('/api/user')
@with_login
def insert_user(user):
    print(f"{user.email} ")
    user_data = request.get_json()
    print(f"{user_data} ")
    user_email=user.email
    insert_user_data(user_data, user_email)
    return jsonify({})


@app.post('/api/feedback')
@with_login
def insert_feedback(user):
    print(f"{user.email} uploaded a file")
    data = request.get_json()
    user = user.email
    piece = data.get('musicsheetid')
    liked = data.get('liked', 0) #default values 
    disliked = data.get('disliked', 0)
    comment = data.get('comment', '')
    insert_feedback(user, piece, liked, disliked, comment)
    return 'Data inserted successfully'

@app.get('/api/pieces/<id>')
def pieces_id(id):
    data = get_pieces_id(id)
    return jsonify({ 
        "data": data
    })

@app.get('/api/pieces/<id>/neighbors')
def pieces_id_neighbors(id: int, size: int = 10):
    array_neighbors = get_neighbors_piece(id, size)
    return jsonify({ 
        "array": array_neighbors
    })