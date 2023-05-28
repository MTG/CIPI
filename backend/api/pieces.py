from .db import database
import json


def get_pieces():
    with database() as cursor:
        # Ejecutar una consulta para obtener los valores de la tabla
        cursor.execute('SELECT * FROM musicsheet')
        # Obtener los nombres de las columnas
        columns = [desc[0] for desc in cursor.description]
        # Obtener todos los registros de la tabla
        rows = cursor.fetchall()
    
    # Crear un diccionario para almacenar los valores de la tabla
    result = []
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
                    "x2": latent_map[1],
                "id": row_dict["musicsheetid"]
            }
        })

    return result
