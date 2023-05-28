import contextlib
from dotenv import load_dotenv, find_dotenv
import psycopg2
import os 

load_dotenv(find_dotenv())

def get_connection():
    print(3)
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
    print(4)
    conn = get_connection()
    print(5)
    cursor = conn.cursor()
    print(6)
    try:
        print(7)
        yield cursor
        print(8)
    except e:
        print(8)
        print(e)
        raise
    finally:
        cursor.close()
        conn.close()
    print(9)
