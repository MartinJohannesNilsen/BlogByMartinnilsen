import os
from pathlib import Path
import json
import time
import requests
import pdb
from dotenv import load_dotenv
from tqdm import tqdm
load_dotenv()
apikey = os.getenv('NEXT_PUBLIC_API_AUTHORIZATION_TOKEN')

# Read backup file and create lists
# backup = Path("/Users/martinjohannesnilsen/Desktop/20240123.txt")
backup = Path("/Users/martinjohannesnilsen/Desktop/20240124.txt")
# Read file
with open(backup) as f:
    data = f.read()
dictionary = json.loads(data)
posts = dictionary["posts"]
postsOverview = dictionary["overview"]

# Headers
headers = {
    'accept': 'application/json',
    'apikey': apikey,
    'Content-Type': 'application/json'
}

# Iterate through posts and restore backup
for post in tqdm(posts):
    stored_post = post["data"]
    stored_post["data"] = json.dumps(stored_post["data"])
    url = f'http://localhost:3000/api/posts/{post["id"]}'
    response = requests.put(url, headers=headers, data=json.dumps(stored_post))
    if response.status_code != 200:
        print(response.json() if response.status_code !=
              500 else {"code": 500, "reason": "Potentially a parsing error due to a missing key!"})
