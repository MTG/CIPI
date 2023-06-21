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


def get_pieces(size, page, period=None, min_difficulty=None, max_difficulty=None, input_string=None):

    result = []
    with database() as cursor:
       # Apply filter if a filter_value is provided
        if period is not None or min_difficulty is not None or max_difficulty is not None or input_string is not None:
            cursor, total_pages = apply_filters(page, cursor, size, period, min_difficulty, max_difficulty, input_string)
        else:
            # No filter applied, retrieve all pieces
            cursor.execute('SELECT COUNT(musicsheetid) FROM musicsheet')
            total_pages = cursor.fetchone()[0]
            # Ensure the page number is within the valid range
            if page < 1:
                page = 1
            elif page > total_pages:
                page = total_pages

            offset = (page - 1) * size

            # Select from the database without the filter and with pagination
            cursor.execute('SELECT * FROM musicsheet LIMIT %(limit)s OFFSET %(offset)s', {'limit':size, 'offset': offset})

        # Get the names of the columns
        columns = [desc[0] for desc in cursor.description]

        # Get the rows for the current page
        rows = cursor.fetchall()

    return list(
        map(to_piece_dto, 
            map(lambda row: get_row_dict(row, columns), 
                rows))), total_pages

def get_pieces_id(id):
    with database() as cursor:
        cursor.execute('SELECT * FROM musicsheet WHERE musicsheetid=%(id)s', {"id": id})
        columns = [desc[0] for desc in cursor.description]
        rows = cursor.fetchall()
        return to_piece_dto(get_row_dict(rows[0], columns))
    

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
                    "x1": float(row_dict["latent_map_x1"]),
                    "x2": float(row_dict["latent_map_x2"])
                },
        "normalized_difficulty": row_dict["normalized_difficulty"],
        "id": row_dict["musicsheetid"],
        "key": row_dict["_key"]
    }