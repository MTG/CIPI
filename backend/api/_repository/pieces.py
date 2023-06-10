from .db import database
import json

def db_dict(rows, columns, result):
    for row in rows:
            row_dict = {}
            for i in range(len(columns)):
                row_dict[columns[i]] = row[i]
            result.append({
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
            })
    return result

def get_pieces():
    with database() as cursor:
        cursor.execute('SELECT * FROM musicsheet')
        columns = [desc[0] for desc in cursor.description]
        rows = cursor.fetchall()

    result = []
    pieces = db_dict(rows, columns, result)

    return pieces

def get_pieces_id(id):
    result = []
    with database() as cursor:
        cursor.execute('SELECT * FROM musicsheet WHERE musicsheetid=%(id)s', {"id": id})
        columns = [desc[0] for desc in cursor.description]
        rows = cursor.fetchall()
        piece=db_dict(rows, columns, result)
    return piece[0]
