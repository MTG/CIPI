from .db import database
from .filtering_functions import apply_filters
import json

def get_row_dict(row, columns):
    row_dict = {}
    for i in range(len(columns)):
        row_dict[columns[i]] = row[i]
    return row_dict

def to_piece_dto(row_dict):
    return {
        "url": row_dict["url"],
        "title": row_dict["work_title"],
        "period": row_dict["composer_period"],
        "author": row_dict["composer"],
        "year": row_dict["first_publication"],
        "difficulty": {
            "x1": row_dict["latent_map_x1"],
            "x2": row_dict["latent_map_x2"]
        },
        "id": row_dict["musicsheetid"],
        "key": row_dict["_key"]
    }


def get_pieces(size, page, key=None, period=None, min_difficulty=None, max_difficulty=None):

    pieces = (get_row_dict(row, columns) for row in rows)
    return list(map(to_piece_dto, pieces))

def get_pieces_id(id):
    with database() as cursor:
        cursor.execute('SELECT * FROM musicsheet WHERE musicsheetid=%(id)s', {"id": id})
        columns = [desc[0] for desc in cursor.description]
        rows = cursor.fetchall()
        return to_piece_dto(get_row_dict(rows[0], columns))

