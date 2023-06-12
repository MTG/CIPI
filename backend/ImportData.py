import pandas as pd
import json
import csv
import numpy as np
import os
import sys




json_name = os.path.join(sys.path[0], "only_one_piece.json")

with open(json_name) as f:
    data = json.load(f)

df = pd.DataFrame(data)

# Handle missing values in 'difficulty_predicted' column
df['difficulty_predicted'].fillna('', inplace=True)

# Convert the values to strings and assign them to new columns
df[['difficulty_predicted_x1', 'difficulty_predicted_x2', 'difficulty_predicted_x3']] = pd.DataFrame(
    df['difficulty_predicted'].apply(lambda x: [str(val) for val in x]).tolist(), index=df.index)

df.drop(['difficulty_predicted', 'latent_map'], axis=1, inplace=True)  # Drop the original columns

noise = np.random.normal(loc=0,scale=1, size=len(df))

# Update 'latent_map_x1' and 'latent_map_x2' columns with noise
df['latent_map_x1'] = df['difficulty_predicted_x1'].astype(float) + noise.astype(float)
df['latent_map_x2'] = df['difficulty_predicted_x2'].astype(float) + noise.astype(float)

# Replace '-' with empty space in 'key' column
df['Key'] = df['Key'].str.replace('-', ' ')

# Split the names and reverse them
df['Composer'] = df['Composer'].str.split(', ').apply(lambda x: ' '.join(reversed(x)))

df.to_csv('only_one_piece.csv', sep='$', index=False)  # Save the modified DataFrame to CSV

