# Developer Setup
1. Use Linux (optional, but recommended)
> If you have Windows, you can use [WSL](https://learn.microsoft.com/en-us/windows/wsl/install) 

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

# Run (development)

```bash
cd backend
flask --app api/index run
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