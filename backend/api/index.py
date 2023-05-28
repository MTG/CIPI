from flask import Flask, jsonify, request
from flask_cors import CORS
from .login import with_login
import os
from dotenv import load_dotenv
import sys
from .pieces import get_pieces 

load_dotenv(".env.development" if os.environ.get('ENV', None) == 'dev' else ".env.production")
load_dotenv(".env")

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
            "x2": 0.01
        },
        "id": "1b80e035-fd87-431d-b3bc-49998d2d4639"
    },
    {
        "title": "On the River Bank",
        "period": "early-20th",
        "author": "Dunhill, Thomas",
        "difficulty": {
            "x1": 0.2,
            "x2": 0.27
        },
        "id": "aff32970-7e9b-4a8c-aff0-a0e23eb99fd5"
    },
    {
        "title": "Notebooks for Anna Magdalena Bach",
        "period": "early-20th",
        "author": "Anna Magdalena Bach",
        "difficulty": {
            "x1": 0.41,
            "x2": 0.39
        },
        "id": "90bead95-859c-47d0-a338-f9b0c3ea71b4"
    },
    {
        "title": "6 Piano Sonatinas",
        "period": "classical",
        "author": "Clementi, Muzio",
        "difficulty": {
            "x1": 0.42,
            "x2": 0.48
        },
        "id": "7a19c9a3-6a28-4398-98db-3e861fa1d160"
    },
    {
        "title": "Livre d'enfants",
        "period": "romantic",
        "author": "Grechaninov, Aleksandr",
        "difficulty": {
            "x1": 0.41,
            "x2": 0.45
        },
        "id": "70e70c59-1514-4633-a89a-34b0c2c3a0b6"
    },
    {
        "title": "Miniatures",
        "period": "romantic",
        "author": "Maykapar, Samuil",
        "difficulty": {
            "x1": 0.506,
            "x2": 0.578
        },
        "id": "9f09a069-d8e8-42e7-91d3-b6a2733bafca"
    },
    {
        "title": "Hausmusik",
        "period": "romantic",
        "author": "Reinecke, Carl",
        "difficulty": {
            "x1": 0.65,
            "x2": 0.61
        },
        "id": "a0282193-3edb-4f8f-86fe-fc4f9f8c33eb"
    },
    {
        "title": "Waltz in A minor",
        "period": "romantic",
        "author": "Chopin, Frédéric",
        "difficulty": {
            "x1": 0.75,
            "x2": 0.783
        },
        "id": "be86fc57-ea9d-4f8d-b2a2-0890a1a8851d"
    },
    {
        "title": "El amor brujo",
        "period": "early-20th",
        "author": "Falla, Manuel de",
        "difficulty": {
            "x1": 0.82,
            "x2": 0.801
        },
        "id": "a9e8c4de-2073-4847-8512-f731ad8a73e7"
    },
    {
        "title": "Chanson triste",
        "period": "romantic",
        "author": "Kalinnikov, Vasily",
        "difficulty": {
            "x1": 0.88,
            "x2": 0.81
        },
        "id": "e368e233-295a-47d2-8eb5-bc21ad3cb202"
    },
    {
        "title": "14 Bagatelles",
        "period": "early-20th",
        "author": "Bartók, Béla",
        "difficulty": {
            "x1": 0.93,
            "x2": 0.97
        },
        "id": "9e8b5f0e-f5ba-4da7-bfd8-bb52e55055bc"
    },
    {
        "title": "Scherzo No.1",
        "period": "romantic",
        "author": "Chopin, Frédéric",
        "difficulty": {
            "x1": 0.98,
            "x2": 0.99
        },
        "id": "04501465-704e-4145-bf5e-ee2df03283e7"
    }
]
@app.get('/api/pieces')
def pieces():
    return jsonify({ 
       "_links": {},
        "array": get_pieces()
    })



@app.get('/api/demoAuth')  # only for demostration purposes
@with_login
def demo_auth(user):
    print(user)
    return jsonify({ 
        "some": "data",
        "user": user
    })
