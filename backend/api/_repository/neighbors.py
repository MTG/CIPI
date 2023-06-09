from .db import database
from .pieces import db_dict
import numpy as np

def get_piece_neighbors(id, size):
    with database() as cursor:
        cursor.execute("SELECT * FROM musicsheet")
        
        columns = [desc[0] for desc in cursor.description]
        rows = cursor.fetchall()
        
        # Get the latent_map array for the input ID
        target_latent_map = None
        for row in rows:
            if row[0] == id:
                target_latent_map = np.array(eval(row[17]))
                break
        
        # Convert the latent_map arrays to NumPy arrays
        latent_maps = [np.array(eval(row[17])) for row in rows]
        
        # Calculate the Euclidean distances between the target and all other latent_map arrays
        distances = [np.linalg.norm(target_latent_map - latent_map) for latent_map in latent_maps]
        
        # Sort the distances and get the indices of the closest entries
        closest_indices = np.argsort(distances)[:size]
        
        closest_entries = []
        db_dict([rows[i] for i in closest_indices], columns, closest_entries)

        return closest_entries
        
        