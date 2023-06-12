import os
import sys
from dotenv import load_dotenv, find_dotenv
import psycopg2

import numpy as np


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
mail VARCHAR(255) PRIMARY KEY,
name VARCHAR(255) NOT NULL,
surname VARCHAR(255) NOT NULL,
study_years VARCHAR(255),
assigned_level INT NOT NULL
)''')

#feedback
cursor.execute('''CREATE TABLE feedback (
feedback_id INT PRIMARY KEY,
musicsheetid INT NOT NULL,
mail VARCHAR(255) NOT NULL,
rating INT NOT NULL,
expressiveness INT NOT NULL,
technical INT NOT NULL,
reasoning VARCHAR(255),
FOREIGN KEY (musicsheetid) REFERENCES musicsheet (musicsheetid),
FOREIGN KEY (mail) REFERENCES _user (mail)
)''')



with open("only_one_piece.csv", 'rb') as f:
    next(f) 
    cursor.copy_from(f, 'musicsheet', sep='$', columns=('url', 'work_title', 'alternative_title', 'composer', 'number_op', 'i_catalog', '_key', 'movements', 'composition_date', 'first_performance', 'first_publication', 'dedication', 'composer_period', 'piece_style', 'instrumentation', 'duration', 'extra_info', 'external_links', 'related_works', 'copyright', 'primary_sources', 'discography', 'translations', 'authorities', 'extra_locations', '_language', 'name_aliases', 'related_pages', 'librettist', 'difficulty_predicted_x1', 'difficulty_predicted_x2', 'difficulty_predicted_x3', 'latent_map_x1','latent_map_x2'))

cursor.execute('''
    DELETE FROM musicsheet
    WHERE difficulty_predicted_x1 = '' AND difficulty_predicted_x2 = '' AND difficulty_predicted_x3 = ''
''')


conn.commit()
cursor.close()
conn.close()







