# Developer Setup
1. Use Linux (optional, but recommended)
> If you have Windows, you can use [WSL](https://learn.microsoft.com/en-us/windows/wsl/install) 

- you must install https://imagemagick.org/script/download.php for processing the pdf
- and downdload from the gdrive the models folder and put it in the backend folder
- pip install -r requeriments.txt

2. Ensure you have Python 3.8 or later installed
```bash
python3 -V
```
> You can [install Python using apt-get](https://docs.python-guide.org/starting/install3/linux/)

3. Create a venv
```bash
python3 -m venv ./venv
source venv/bin/activate
```

4. Install external libraries
```bash
pip3 install -r requirements.txt
```

5. Create a `.env` file with the required environment variables (replace `...` by the needed secrets)
```
DATABASE_NAME='...'
DATABASE_HOST='...'
DATABASE_USER='...'
DATABASE_PASSWORD='...'
DATABASE_PORT='...'
DATABASE_SSLMODE='...'
REPLICATE_API_TOKEN='...'
``` 

# Run (development)

```bash
cd backend
export ENV=dev
export FLASK_APP=api/index.py
flask run --reload
```

# Install the requirements to run the GPT model
```bash
pip3 install -r requirements-dev.txt
```

# Run (with Vercel)

This backend uses the Web Server Gateway Interface (WSGI) with Flask to enable handling requests on Vercel with Serverless Functions.

```bash
npm i -g vercel
vercel dev
```

# Deploy manually
```bash
vercel deploy
```

# Seeding
Run `seed.py` to seed the database.