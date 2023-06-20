from .db import database
from .pieces import get_row_dict, to_piece_dto

def get_neighbors_piece(piece_id, size):
    sql = '''
        SELECT
            neighbour.*
        FROM
            musicsheet AS piece
        JOIN
            musicsheet AS neighbour ON neighbour.musicsheetid != piece.musicsheetid
        WHERE
            piece.musicsheetid = %s
        ORDER BY SQRT(POWER(neighbour.latent_map_x1::DOUBLE PRECISION - piece.latent_map_x1::DOUBLE PRECISION, 2) + POWER(neighbour.latent_map_x2::DOUBLE PRECISION - piece.latent_map_x2::DOUBLE PRECISION, 2))
        LIMIT %s;
    '''

    with database() as cursor:
        cursor.execute(sql, (piece_id, size))
        columns = [desc[0] for desc in cursor.description]
        rows = cursor.fetchall()
        
    return list(map(to_piece_dto, map(lambda r: get_row_dict(r, columns), rows)))


def get_neighbors_piece_difficulty(difficulty, size):
    sql = '''
        SELECT
            neighbour.*
        FROM
            musicsheet AS neighbour
        ORDER BY SQRT(POWER(neighbour.latent_map_x1::DOUBLE PRECISION - %s, 2) + POWER(neighbour.latent_map_x2::DOUBLE PRECISION - %s, 2))
        LIMIT %s;
    '''

    with database() as cursor:
        cursor.execute(sql, (int(difficulty[0]), int(difficulty[0]), size))
        columns = [desc[0] for desc in cursor.description]
        rows = cursor.fetchall()
        
    return list(map(to_piece_dto, map(lambda r: get_row_dict(r, columns), rows)))
