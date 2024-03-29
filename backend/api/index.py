from ._repository.feedback import insert_feedback_data
from flask import Flask, jsonify, request
from flask_cors import CORS

from ._repository.user import has_user_data, insert_user_data
from ._auth.login import with_login
import os
from dotenv import load_dotenv
from ._repository.pieces import get_pieces, get_pieces_id
from ._clients.pdf_difficulty_service import get_difficulty, start_model
from ._repository.neighbors import get_neighbors_piece, get_neighbors_piece_difficulty
from ._repository.feedback import insert_feedback_data
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
    pieces, pages_count = get_pieces(
        size, 
        page, 
        period, 
        min_difficulty, 
        max_difficulty, 
        input_string)
    
    return jsonify({ 
         "_links": {
            "total_pages": pages_count
        },
        "array": pieces
    })


@app.post('/api/difficultyAnalysis')
@with_login
def start_upload(user):
    print(f"{user.email} uploaded a file")
    score_file = request.files.get('score')
    id = start_model(score_file)
    return jsonify({ 
        "data": {
            "id": id
        }
    })


@app.get('/api/difficultyAnalysis/<id>')
@with_login
def get_upload_results(user, id):
    print(f"{user.email} retrieving results for {id}")
    status, difficulty = get_difficulty(id)
    return jsonify({ 
        "data": {
            "difficulty": difficulty,
            "status": status,
            "pieces": get_neighbors_piece_difficulty(difficulty, 13) if status == "succeeded" else None # 13 closest pieces by difficulty
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
    user_email=user.email
    insert_user_data(user_data, user_email)
    return jsonify({})


@app.get('/api/user')
@with_login
def get_user(user):
    user_email=user.email
    return jsonify({"hasData":has_user_data(user_email)})



@app.post('/api/feedback')
@with_login
def insert_feedback(user):
    print(f"{user.email}")
    data = request.get_json()
    user = user.email
    print(f"{user}")
    piece = data.get('musicsheetid')
    liked = data.get('liked', 0) #default values 
    disliked = data.get('disliked', 0)
    comment = data.get('comment', '')
    insert_feedback_data(user, piece, liked, disliked, comment)
    return jsonify({})

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

