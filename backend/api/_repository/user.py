from .db import database

def insert_user_data(user_data, user_mail):
    answers = [x["answer"] for x in user_data["answers"]]

    with database() as cursor:
        cursor.execute('''
        INSERT INTO _user (mail, study_years, piece1_id, difficulty_piece1, piece2_id, difficulty_piece2, piece3_id, difficulty_piece3)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
    ''', (
            user_mail,  # mail
            answers[0],  # study_years
            'LyricalPiece_Beyer',  # piece1
            answers[1],  # difficulty_piece1
            'Chopin_WaltzinAminor',  # piece2
            answers[2],  # difficulty_piece2
            'Chopin_Polonaise-fantaisie',  # piece3
            answers[3],  # difficulty_piece3
          ))