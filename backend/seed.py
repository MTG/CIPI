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

cursor.execute("DROP TABLE IF EXISTS feedback")
cursor.execute("DROP TABLE IF EXISTS _user")
cursor.execute("DROP TABLE IF EXISTS musicsheet")

#Music Sheet
cursor.execute('''CREATE TABLE musicsheet (
musicsheetid SERIAL PRIMARY KEY,
url VARCHAR(8000),
work_title VARCHAR(8000),
alternative_title VARCHAR(8000),
composer VARCHAR(8000),
number_op VARCHAR(8000),
i_catalog VARCHAR(8000),
_key VARCHAR(8000),
movements VARCHAR(8000),
composition_date VARCHAR(8000),
first_performance VARCHAR(8000),
first_publication VARCHAR(8000),
dedication VARCHAR(8000),
composer_period VARCHAR(8000),
piece_style VARCHAR(8000),
instrumentation VARCHAR(8000),
duration VARCHAR(8000),
extra_info VARCHAR(8000),
external_links VARCHAR(8000),
related_works VARCHAR(8000),
copyright VARCHAR(8000),
primary_sources VARCHAR(8000),
discography VARCHAR(8000),
translations VARCHAR(8000),
authorities VARCHAR(8000),
extra_locations VARCHAR(8000),
_language VARCHAR(8000),
name_aliases VARCHAR(8000),
related_pages VARCHAR(8000),
librettist VARCHAR(8000),
difficulty_predicted_x1 VARCHAR(8000) NOT NULL,
difficulty_predicted_x2 VARCHAR(8000) NOT NULL,
difficulty_predicted_x3 VARCHAR(8000) NOT NULL,
latent_map_x1 VARCHAR(8000),
latent_map_x2 VARCHAR(8000)
)''')

#user
cursor.execute('''CREATE TABLE _user (
mail VARCHAR(8000) PRIMARY KEY,
study_years VARCHAR(8000),
piece1_id VARCHAR(8000) ,
difficulty_piece1 VARCHAR(8000) NOT NULL,
piece2_id VARCHAR(8000),
difficulty_piece2 VARCHAR(8000) NOT NULL,
piece3_id VARCHAR(8000),
difficulty_piece3 VARCHAR(8000) NOT NULL
)''')

#feedback
cursor.execute('''CREATE TABLE feedback(
feedback_id SERIAL PRIMARY KEY,
user_mail VARCHAR(8000) NOT NULL,
musicsheetid INT NOT NULL,
liked INT,
disliked INT,
comment VARCHAR(8000),
FOREIGN KEY (musicsheetid) REFERENCES musicsheet (musicsheetid),
FOREIGN KEY (user_mail) REFERENCES _user (mail)
)''')

#insert data

with open("only_one_piece.csv", 'rb') as f:
    next(f) 
    cursor.copy_from(f, 'musicsheet', sep='$', columns=('url', 'work_title', 'alternative_title', 'composer', 'number_op', 'i_catalog', '_key', 'movements', 'composition_date', 'first_performance', 'first_publication', 'dedication', 'composer_period', 'piece_style', 'instrumentation', 'duration', 'extra_info', 'external_links', 'related_works', 'copyright', 'primary_sources', 'discography', 'translations', 'authorities', 'extra_locations', '_language', 'name_aliases', 'related_pages', 'librettist', 'difficulty_predicted_x1', 'difficulty_predicted_x2', 'difficulty_predicted_x3', 'latent_map_x1','latent_map_x2'))

cursor.execute('''
    DELETE FROM musicsheet
    WHERE difficulty_predicted_x1 = '' AND difficulty_predicted_x2 = '' AND difficulty_predicted_x3 = ''
''')

cursor.execute('''ALTER TABLE musicsheet ADD COLUMN normalized_difficulty DECIMAL(5, 2)''')

cursor.execute('''UPDATE musicsheet
SET normalized_difficulty = ((CAST(difficulty_predicted_x1 AS DECIMAL) / 8) * 3 + (CAST(difficulty_predicted_x2 AS DECIMAL) / 8) * 3 + (CAST(difficulty_predicted_x3 AS DECIMAL) / 4) * 3);
''')   

cursor.execute('''
    ALTER TABLE musicsheet ADD COLUMN ts tsvector
    GENERATED ALWAYS AS (to_tsvector('english', work_title || ' ' || alternative_title || ' ' || composer)) STORED;

''')
      
#Create a GIN index to make our searches faster
cursor.execute('''
    CREATE INDEX ts_idx ON musicsheet USING GIN (ts);

''' )            

conn.commit()
cursor.close()
conn.close()