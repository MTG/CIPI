
import replicate
import io

def get_difficulty(score_file):
    score_buffer = io.BufferedReader(score_file)
    return replicate.run(
        "pramoneda/test:7ccc1e7ea2040c09f4b3e2c5279e90a9825c1e7a8e489a26566f377e57110da6",
        input={"pdf": score_buffer}
    )
