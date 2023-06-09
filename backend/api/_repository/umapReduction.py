from db import database
import json
import numpy as np
import umap
from sklearn.cluster import KMeans
from pieces import get_pieces

def apply_umap(pieces_list, noise_std):
    # Extract the difficulty values
    difficulty_predicted_values = [[float(piece['difficulty_predicted']['x1']),
                                    float(piece['difficulty_predicted']['x2']),
                                    float(piece['difficulty_predicted']['x3'])]
                                    for piece in pieces_list]

    # Convert difficulty values to a numpy array
    difficulty_array = np.array(difficulty_predicted_values)

    # Apply UMAP
    reducer = umap.UMAP(n_components=2)
    transformed_values = reducer.fit_transform(difficulty_array)

    # Add Gaussian noise to the transformed values
    noise = np.random.normal(loc=0, scale=noise_std, size=transformed_values.shape)
    transformed_values_with_noise = transformed_values + noise


    # Return the transformed values with noise and labels
    return transformed_values_with_noise.tolist()

pieces_list = get_pieces()

# Apply UMAP to the "difficulty_predicted" values
transformed_values = apply_umap(pieces_list, 1)

# Update the "latent_map" column in the database
with database() as cursor:
    for i, piece in enumerate(pieces_list):
        cursor.execute("UPDATE musicsheet SET latent_map_x1= %s, latent_map_x2=%s WHERE musicsheetid = %s",
                        (json.dumps(transformed_values[i][0]), json.dumps(transformed_values[i][1]), piece['id']))

    # Commit the changes to the database
    cursor.connection.commit()





# Extract the x and y values from transformed values
x = [point[0] for point in transformed_values]
y = [point[1] for point in transformed_values]

# # Plot the transformed values
plt.scatter(x, y)


plt.xlabel('UMAP Dimension 1')
plt.ylabel('UMAP Dimension 2')
plt.title('UMAP Transformed Values')
plt.show()
