from .db import database

def insert_feedback_data(user, piece, liked, disliked, comment):
    with database() as cursor:
        cursor.execute('''
        INSERT INTO feedback (user_mail, musicsheetid, liked, disliked, comment)
        VALUES (%s, %s, %s, %s, %s)
        ''', (user, piece, liked, disliked, comment))
        
        