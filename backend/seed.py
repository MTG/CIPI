import os
import sys
from dotenv import load_dotenv, find_dotenv
import psycopg2
from pca import apply_svd


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


#insert data

csv_file_name = os.path.join(sys.path[0], "only_one_piece.csv")

with open(csv_file_name, 'rb') as f:
    next(f) 
    cursor.copy_from(f, 'musicsheet', sep='$', columns=('url', 'work_title', 'alternative_title', 'composer', 'number_op', 'i_catalog', '_key', 'movements', 'composition_date', 'first_performance', 'first_publication', 'dedication', 'composer_period', 'piece_style', 'instrumentation', 'duration', 'extra_info', 'external_links', 'related_works', 'copyright', 'primary_sources', 'discography', 'translations', 'authorities', 'extra_locations', '_language', 'name_aliases', 'related_pages', 'librettist', 'difficulty_predicted_x1', 'difficulty_predicted_x2', 'difficulty_predicted_x3', 'latent_map_x1','latent_map_x2'))

cursor.execute('''
    DELETE FROM musicsheet
    WHERE difficulty_predicted_x1 = '' AND difficulty_predicted_x2 = '' AND difficulty_predicted_x3 = ''
''')



# Retrieve all pieces from the musicsheet table
cursor.execute('SELECT musicsheetid, difficulty_predicted_x1, difficulty_predicted_x2 FROM musicsheet')
rows = cursor.fetchall()

pieces_list = []
update_values = []

for row in rows:
    piece = {
        "id": row[0],
        "difficulty_predicted": {
            "x1": row[1],
            "x2": row[2]
        }
    }
    pieces_list.append(piece)

# Apply SVD to the "difficulty_predicted" values for all rows
transformed_values = apply_svd(pieces_list, 1)

# Prepare the update values for all rows
update_values = [(transformed_values[i][0], transformed_values[i][1], piece['id']) for i, piece in enumerate(pieces_list)]

# Update the "latent_map_x1" and "latent_map_x2" columns in the database
update_query = "UPDATE musicsheet SET latent_map_x1 = %s, latent_map_x2 = %s WHERE musicsheetid = %s"
cursor.executemany(update_query, update_values)

conn.commit()
cursor.close()
conn.close()







