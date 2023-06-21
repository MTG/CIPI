from .db import database

def insert_feedback_data(user, piece, liked, disliked, comment):
    with database() as cursor:
        cursor.execute('''
        INSERT INTO feedback (user, piece, liked, disliked, comment)
        VALUES (%s, %s, %s, %s, %s)
    ''', (user, piece, liked, disliked, comment))
        
        