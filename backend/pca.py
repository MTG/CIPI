import numpy as np
import plotly.graph_objects as go

def apply_svd(pieces_list, noise_std):
    # Extract the difficulty values
    difficulty_predicted_values = [[float(piece['difficulty_predicted']['x1']), 
                                    float(piece['difficulty_predicted']['x2'])] 
                                    for piece in pieces_list]

    # Convert difficulty values to a numpy array
    transformed_values = np.array(difficulty_predicted_values)

    # Add Gaussian noise to the transformed values
    noise = np.random.normal(loc=0, scale=noise_std, size=transformed_values.shape)
    transformed_values_with_noise = transformed_values + noise

    # Return the transformed values with noise
    return transformed_values_with_noise.tolist()


def plot_latent_map(transformed_values, pieces_list):
    x = [point[0] for point in transformed_values]
    y = [point[1] for point in transformed_values]

    # Text for each data point
    hover_text = [
        p["work_title"] + "  " + p["composer"] +  "\n " +
        str(p['difficulty_predicted']['x1']) +  "  " +
        str(p['difficulty_predicted']['x2']) + "  " +
        str(p['difficulty_predicted']['x3'])
        for p in pieces_list
    ]

    fig = go.Figure(data=go.Scatter(
        x=x,
        y=y,
        mode='markers',
        marker=dict(
            size=16,
            color=y,  # set color to an array/list of desired values
            colorscale='Viridis',  # choose a colorscale
            showscale=True  # to show the legend according to the color
        ),
        text=hover_text,  # this sets hover text
        hoverinfo='text'  # this ensures only your text is shown on hover
    ))

    fig.show()

