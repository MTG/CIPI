from flask import Flask, jsonify, request
from flask_cors import CORS
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


@app.post('/api/pieces')
@with_login
def new_piece(user):
    print(f"{user.email} uploaded a file")
    score_file = request.files.get('score')
    difficulty = get_difficulty(score_file)
    return jsonify({ 
        "data": {
            "difficulty": difficulty,
            "pieces": get_neighbors_piece_difficulty(difficulty, 13)  # 13 closest pieces by difficulty
        }
    })


@app.post('/auth')
@with_login
def auth(user):
    return jsonify({
        "user": user
    })

@app.get('/api/pieces/<id>')
def pieces_id(id):
    data = get_pieces_id(id)
    return jsonify({ 
        "data": data
    })

@app.get('/api/pieces/<id>/neighbors')
def pieces_id_neighbors(id):
    args = request.args
    id=int(args.get("id"))
    size=int(args.get("size"))
    array_neighbors= get_neighbors_piece(id, size)
    return jsonify({ 
        "array": array_neighbors
    })
