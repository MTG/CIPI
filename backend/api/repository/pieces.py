from .db import database
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

def get_pieces(size, page):

    result = []
    with database() as cursor:
       
        cursor.execute('SELECT COUNT(musicsheetid) FROM musicsheet')
        total_pages=cursor.fetchone()[0]
        # Ensure the page number is within the valid range
        if page < 1:
            page = 1
        elif page > total_pages:
            page = total_pages
        
        offset = (page) * size

        # Execute a query with LIMIT and OFFSET clauses to retrieve the current page of results
        print(size, offset)
        cursor.execute('SELECT * FROM musicsheet LIMIT %(limit)s OFFSET %(offset)s', {'limit':size, 'offset': offset})
        
        # Get the names of the columns
        columns = [desc[0] for desc in cursor.description]

        # Get the rows for the current page
        rows = cursor.fetchall()
        pieces=db_dict(rows, columns, result)
        
    return pieces, total_pages

def get_pieces_id(id):
    result = []
    with database() as cursor:
        cursor.execute('SELECT * FROM musicsheet WHERE musicsheetid=%(id)s', {"id": id})
        columns = [desc[0] for desc in cursor.description]
        rows = cursor.fetchall()
        piece=db_dict(rows, columns, result)
    return piece[0]
