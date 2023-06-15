import pandas as pd
import json
import csv
import numpy as np
import os
import sys

json_name1 = os.path.join(sys.path[0], "only_one_piece.json")
json_name2 = os.path.join(sys.path[0], "para_rat.json")

# Load the contents of the first JSON file
with open(json_name1) as f1:
    data1 = json.load(f1)

# Load the contents of the second JSON file
with open(json_name2) as f2:
    data2 = json.load(f2)



# Rename the columns in the second JSON file to match the first JSON file
column_mapping = {
    "composer": "Composer",
    "key": "Key",
    "pdf_url": "url",
    "period": "Composer Time PeriodComp. Period",
    "year": "Year/Date of CompositionY/D of Comp.",
    "work": "Work Title",
    "difficulty_predicted": "difficulty_predicted"
}

# Create a new dictionary with renamed keys and transposed data
data2_renamed = {}
for row_key, row_value in data2.items():
    for col_key, col_value in row_value.items():
        if col_key in column_mapping:
            new_col_key = column_mapping[col_key]
            if new_col_key not in data2_renamed:
                data2_renamed[new_col_key] = []
            data2_renamed[new_col_key].append(col_value)



# Create a DataFrame from the first JSON file
df1 = pd.DataFrame(data1)

# Create a DataFrame from the renamed second JSON file
df2 = pd.DataFrame(data2_renamed)

# Drop unnecessary columns from the second DataFrame
columns_to_drop = ['type', 'difficulty', 'year']
df2 = df2.drop(columns_to_drop, axis=1, errors='ignore')


df1['difficulty_predicted'].fillna('', inplace=True)

# Convert the values to strings and assign them to new columns
df1[['difficulty_predicted_x1', 'difficulty_predicted_x2', 'difficulty_predicted_x3']] = pd.DataFrame(
    df1['difficulty_predicted'].apply(lambda x: [str(val) for val in x]).tolist(), index=df1.index)

df1.drop(['difficulty_predicted', 'latent_map'], axis=1, inplace=True)  # Drop the original columns

df2['difficulty_predicted'].fillna('', inplace=True)
# Perform the desired operations on the second DataFrame (df2)
df2[['difficulty_predicted_x1', 'difficulty_predicted_x2', 'difficulty_predicted_x3']] = pd.DataFrame(
    df2['difficulty_predicted'].apply(lambda x: [str(val) for val in x]).tolist(), index=df2.index)

df2.drop(['difficulty_predicted'], axis=1, inplace=True)

# Merge the two DataFrames (df1 and df2)
merged_df = pd.concat([df1, df2], ignore_index=True)
merged_df['latent_map_x1'] = merged_df['difficulty_predicted_x1'].astype(float) + np.random.normal(loc=0, scale=1, size=len(merged_df)).astype(float)
merged_df['latent_map_x2'] = merged_df['difficulty_predicted_x2'].astype(float) + np.random.normal(loc=0, scale=1, size=len(merged_df)).astype(float)

merged_df['Key'] = merged_df['Key'].str.replace('-', ' ')

merged_df['Composer'] = merged_df['Composer'].str.split(', ').apply(lambda x: ' '.join(reversed(x)))

merged_df.to_csv('only_one_piece.csv', sep='$', index=False)  # Save the merged DataFrame to CSV
