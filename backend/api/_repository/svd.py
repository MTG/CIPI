import os
import sys
from dotenv import load_dotenv, find_dotenv

import numpy as np
from sklearn.decomposition import TruncatedSVD
from pieces import get_pieces
import matplotlib.pyplot as plt

def apply_svd(pieces_list, noise_std):
    # Extract the difficulty values
    difficulty_predicted_values = [[float(piece['difficulty_predicted']['x1']), 
                                    float(piece['difficulty_predicted']['x2']), 
                                    float(piece['difficulty_predicted']['x3'])] 
                                    for piece in pieces_list]

    # Convert difficulty values to a numpy array
    difficulty_array = np.array(difficulty_predicted_values)

    # Apply SVD
    svd = TruncatedSVD(n_components=2)
    transformed_values = svd.fit_transform(difficulty_array)

    # Add Gaussian noise to the transformed values
    noise = np.random.normal(loc=0, scale=noise_std, size=transformed_values.shape)
    transformed_values_with_noise = transformed_values + noise

    # Return the transformed values with noise
    return transformed_values_with_noise.tolist()

pieces_list = get_pieces()

# Apply SVD to the "difficulty_predicted" values
transformed_values = apply_svd(pieces_list, 1)

# Extract the x and y values from transformed values
x = [point[0] for point in transformed_values]
y = [point[1] for point in transformed_values]

# Plot the transformed values
plt.scatter(x, y)
plt.xlabel('Component 1')
plt.ylabel('Component 2')
plt.title('SVD Transformed Values')


# Show the plot
plt.show()
