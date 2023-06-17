from dotenv import load_dotenv, find_dotenv
load_dotenv(find_dotenv())

print(type(open("./examples/124.pdf", "rb")))

import replicate
output = replicate.run(
    "pramoneda/test:7ccc1e7ea2040c09f4b3e2c5279e90a9825c1e7a8e489a26566f377e57110da6",
    input={"pdf": open("./examples/124.pdf", "rb")}
)
print(output)