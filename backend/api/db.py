import contextlib
from dotenv import load_dotenv, find_dotenv
import psycopg2
import os 

load_dotenv(find_dotenv())

def get_connection():
    return psycopg2.connect(
        database=os.getenv("DATABASE_NAME"),
        host=os.getenv("DATABASE_HOST"),
        user=os.getenv("DATABASE_USER"),
        password=os.getenv("DATABASE_PASSWORD"),
        port=os.getenv("DATABASE_PORT"),
        sslmode=os.getenv("DATABASE_SSLMODE")
    )


@contextlib.contextmanager
def database():
    conn = get_connection()
    cursor = conn.cursor()
    try:
        yield cursor
    finally:
        cursor.close()
        conn.close()
