from .db import database
from .pieces import to_piece_dto, get_row_dict
import numpy as np


def _get_latent_map(piece):
    return np.array([float(piece["latent_map_x1"]), float(piece["latent_map_x2"])])


def _get_piece_neighbors(pieces, target_latent_map, size):
    print(1, target_latent_map)
    target_latent_map = target_latent_map[:2]
    print(2, target_latent_map)
    # Convert the latent_map arrays to NumPy arrays
    latent_maps = list(map(_get_latent_map, pieces))
    
    print(3, latent_maps[0])

    # Calculate the Euclidean distances between the target and all other latent_map arrays
    distances = [np.linalg.norm(target_latent_map - latent_map) for latent_map in latent_maps]
    
    # Sort the distances and get the indices of the closest entries
    closest_indices = np.argsort(distances)[:size]
    
    return [to_piece_dto(pieces[i]) for i in closest_indices]
        

def _fetch_all_pieces():
     with database() as cursor:
        cursor.execute("SELECT * FROM musicsheet")
        
        columns = [desc[0] for desc in cursor.description]
        return [get_row_dict(row, columns) for row in cursor.fetchall()]


def get_piece_neighbours_by_latent_map(target_latent_map, size):
    pieces = _fetch_all_pieces()
    return _get_piece_neighbors(pieces, target_latent_map, size)


def get_piece_neighbors_by_id(id, size):
    pieces = _fetch_all_pieces()
    # Get the latent_map array for the input ID
    target_latent_map = None
    for piece in pieces:
        if piece['musicsheetid'] == id:
            target_latent_map = _get_latent_map(piece)
            break
    
    return _get_piece_neighbors(pieces, target_latent_map, size)

        