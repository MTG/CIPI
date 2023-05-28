from flask import Flask, jsonify
from flask_cors import CORS
import os
import sys
from dotenv import load_dotenv, find_dotenv
import psycopg2

load_dotenv(find_dotenv())

conn = psycopg2.connect(database=os.getenv("DATABASE_NAME"),
                        host=os.getenv("DATABASE_HOST"),
                        user=os.getenv("DATABASE_USER"),
                        password=os.getenv("DATABASE_PASSWORD"),
                        port=os.getenv("DATABASE_PORT"),
                        sslmode=os.getenv("DATABASE_SSLMODE"))

cursor = conn.cursor()

app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return 'Hello, World 4!'

@app.route('/api/test')
def about():
    return jsonify({ "hello": "world" })

# Ejecutar una consulta para obtener los valores de la tabla
cursor.execute('SELECT * FROM musicsheet')
# Obtener los nombres de las columnas
columns = [desc[0] for desc in cursor.description]
# Obtener todos los registros de la tabla
rows = cursor.fetchall()

# Cerrar el cursor y la conexion a la base de datos
cursor.close()
conn.close()
# Crear un diccionario para almacenar los valores de la tabla
result = []
for row in rows:
    row_dict = {}
    for i in range(len(columns)):
        row_dict[columns[i]] = row[i]
    result.append(row_dict)


@app.route('/api/pieces')
def pieces():
    return jsonify({ 
       "_links": {},
        "array": result
    })