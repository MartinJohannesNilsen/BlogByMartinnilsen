import os
from pathlib import Path
import json
import time
import requests
import pdb
from dotenv import load_dotenv
from tqdm import tqdm
import urllib.parse
load_dotenv()
apikey = os.getenv('API_AUTHORIZATION_TOKEN')

# Read backup file and create lists
backup = Path("/Users/martinjohannesnilsen/Desktop/20240123.txt")
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
for post in posts:
    data = {
        "ogImage": {
            "src": post["data"]["image"] if post["data"]["image"] != "" else "https://blog.mjntech.dev/assets/icons/ogimage.png",
            "blurhash": None,
            "height": None,
            "width": None,
        }
    }
    url = f'http://localhost:3000/api/editorjs/imageblurhash?url={urllib.parse.quote(data["ogImage"]["src"])}'
    # print(url)
    details_req = requests.get(url, headers=headers, data=json.dumps(data))
    if details_req.status_code != 200:
        print("Something went wrong while generating blurhash")
        exit(1)
    details = details_req.json()
    data["ogImage"]["blurhash"] = details["encoded"]
    data["ogImage"]["height"] = details["height"]
    data["ogImage"]["width"] = details["width"]

    # Update ogImage in post
    # url = f'http://localhost:3000/api/posts/{post["id"]}'
    # response = requests.put(url, headers=headers, data=json.dumps(data))
    # if response.status_code != 200:
    # print(response.text)
    print(post["id"], json.dumps(data))
    input()
