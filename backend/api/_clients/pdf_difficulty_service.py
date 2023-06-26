
import replicate
import io

def start_model(score_file):
    score_buffer = io.BufferedReader(score_file)
    model = replicate.models.get("pramoneda/test")
    version = model.versions.get("7ccc1e7ea2040c09f4b3e2c5279e90a9825c1e7a8e489a26566f377e57110da6")
    prediction = replicate.predictions.create(version=version, input={"pdf": score_buffer})
    return prediction.id
    
def get_difficulty(id):
    prediction = replicate.predictions.get(id=id)
    return prediction.status, prediction.output
    
    