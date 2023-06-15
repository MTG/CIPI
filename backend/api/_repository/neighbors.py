from .db import database

def get_neighbors_piece(piece_id):
    sql = '''
        SELECT
            neighbour.musicsheetid AS neighbour_id,
            SQRT(POWER(neighbour.latent_map_x1::DOUBLE PRECISION - piece.latent_map_x1::DOUBLE PRECISION, 2) + POWER(neighbour.latent_map_x2::DOUBLE PRECISION - piece.latent_map_x2::DOUBLE PRECISION, 2)) AS distance
        FROM
            musicsheet AS piece
        JOIN
            musicsheet AS neighbour ON neighbour.musicsheetid != piece.musicsheetid
        WHERE
            piece.musicsheetid = %s;
    '''



    with database() as cursor:
        cursor.execute(sql, (piece_id,))
        results = cursor.fetchall()

    return results


def get_neighbors_piece_difficulty(difficulty):
    sql = '''
        SELECT
            neighbour.musicsheetid AS neighbour_id
        FROM
            musicsheet AS piece
        JOIN
            musicsheet AS neighbour ON neighbour.musicsheetid != piece.musicsheetid
        WHERE
            piece.difficulty_predicted_x1::INTEGER = %s
            OR piece.difficulty_predicted_x2::INTEGER = %s
            OR piece.difficulty_predicted_x3::INTEGER = %s
        ORDER BY
            SQRT(POWER(neighbour.latent_map_x1::DOUBLE PRECISION - piece.latent_map_x1::DOUBLE PRECISION, 2) + POWER(neighbour.latent_map_x2::DOUBLE PRECISION - piece.latent_map_x2::DOUBLE PRECISION, 2)) ASC
        LIMIT 10;
    '''

    with database() as cursor:
        cursor.execute(sql, (int(difficulty), int(difficulty), int(difficulty)))
        results = cursor.fetchall()

    piece_ids = [result[0] for result in results]  # Extract the piece IDs from the tuples
    return piece_ids






""" difficulty = 4  # Example difficulty value
neighbors = get_neighbors_piece_difficulty(difficulty)
print(neighbors) """


