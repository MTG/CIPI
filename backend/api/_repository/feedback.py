from .db import database

def insert_into_feedback(user, piece, liked, disliked, comment):
    print(piece)
    with database() as cursor:
        cursor.execute('''
        INSERT INTO feedback (user, piece, liked, disliked, comment)
        VALUES (%s, %s, %s, %s, %s)
        ''', (user, piece, liked, disliked, comment))
        
        