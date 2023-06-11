from db import database

def get_neighbours_piece():
    neighbors = {}

    with database() as cursor:
        # Execute the SQL query to calculate the Euclidean distance
        query = """
        SELECT musicsheetid, CAST(
            ROUND(
                SQRT(
                    SQUARE(Abs(MIN(latent_map_x1) - MAX(latent_map_x1)))
                    + SQUARE(Abs(MIN(latent_map_x2) - MAX(latent_map_x2)))
                ), 4)
            AS decimal(18,4))
        FROM musicsheet
        GROUP BY musicsheetid;
        """
        cursor.execute(query)
        rows = cursor.fetchall()

        for row in rows:
            piece_id = row[0]
            distance = row[1]
            neighbors[piece_id] = distance

    return neighbors


