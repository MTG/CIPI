from backend.api.diff_model.convert2machine import convert2machine
from backend.api.diff_model.predict_difficulty import predict_difficulty

# the score we want predict
path_score = "examples/124.pdf"

# convert to a machine readable format
machine_readable_mtrx = convert2machine(path_score)
print(machine_readable_mtrx.shape)

# predict the difficulty

cipi, ps, fs = predict_difficulty(machine_readable_mtrx)
print(cipi, ps, fs)



# predict the latent space coordinates of the map view

