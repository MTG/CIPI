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


def get_pieces():
    with database() as cursor:
        cursor.execute('SELECT * FROM musicsheet')
        columns = [desc[0] for desc in cursor.description]
        rows = cursor.fetchall()

    result = []
    for row in rows:
        row_dict = {}
        for i in range(len(columns)):
            row_dict[columns[i]] = row[i]

        result.append({
            "title": row_dict["work_title"],
            "period": row_dict["composer_period"],
            "author": row_dict["composer"],
            "difficulty": {
                "x1": json.loads(row_dict["latent_map_x1"]),
                "x2": json.loads(row_dict["latent_map_x2"])
            },
            "difficulty_predicted": {
                "x1": json.loads(row_dict["difficulty_predicted_x1"]),
                "x2": json.loads(row_dict["difficulty_predicted_x2"]),
                "x3": json.loads(row_dict["difficulty_predicted_x3"])
            },
            "id": row_dict["musicsheetid"],
        })

    return result

def get_pieces_id(id):
    with database() as cursor:
        cursor.execute('SELECT * FROM musicsheet WHERE musicsheetid=%(id)s', {"id": id})
        columns = [desc[0] for desc in cursor.description]
        rows = cursor.fetchall()
        return to_piece_dto(get_row_dict(rows[0], columns))

