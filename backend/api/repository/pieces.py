from db import database
import json

def db_dict(rows, columns, result):
    for row in rows:
            row_dict = {}
            for i in range(len(columns)):
                row_dict[columns[i]] = row[i]
            latent_map = json.loads(row_dict["latent_map"])
            result.append({
                "title": row_dict["work_title"],
                "period": row_dict["composer_period"],
                "author": row_dict["composer"],
                "difficulty": {
                    "x1": latent_map[0],
                    "x2": latent_map[1]
                },
                "id": row_dict["musicsheetid"]
            })
    return result

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
    result = []
    with database() as cursor:
        cursor.execute('SELECT * FROM musicsheet WHERE musicsheetid=%(id)s', {"id": id})
        columns = [desc[0] for desc in cursor.description]
        rows = cursor.fetchall()
        piece=db_dict(rows, columns, result)
    return piece[0]
