import os
from pathlib import Path
import json
import requests
from dotenv import load_dotenv
from tqdm import tqdm
from pymongo import MongoClient
load_dotenv()
apikey = os.getenv('API_AUTHORIZATION_TOKEN')

# Headers
headers = {
    'accept': 'application/json',
    'apikey': apikey,
    'Content-Type': 'application/json'
}

out_dir = Path(os.path.abspath(__file__)).parent / "backup"


def save_overview():
    out = out_dir / "overview"
    out.mkdir(parents=True, exist_ok=True)
    overview = requests.get(
        "http://localhost:3000/api/overview", headers=headers)
    json_list = json.loads(overview.content)
    file_path = out / 'document.json'
    with open(file_path, 'w') as file:
        json.dump(json_list, file, indent=4)


def save_tags():
    out = out_dir / "tags"
    out.mkdir(parents=True, exist_ok=True)
    tags = requests.get(
        "http://localhost:3000/api/tags", headers=headers)
    json_list = json.loads(tags.content)
    file_path = out / 'document.json'
    with open(file_path, 'w') as file:
        json.dump(json_list, file, indent=4)


def save_posts():

    def save_json_documents(json_list, directory=Path('json_documents')):

        # Ensure the target directory exists
        if not os.path.exists(directory):
            os.makedirs(directory)

        # Iterate through the list and save each JSON document
        for i, json_doc in enumerate(json_list):
            id = json_doc["id"]
            del json_doc["id"]
            with open(directory / f"{id}.json", 'w') as file:
                json.dump(json_doc, file, indent=4)

        print(
            f'Successfully saved {len(json_list)} JSON documents to the "{directory}" directory.')

    out = out_dir / "posts"
    out.mkdir(parents=True, exist_ok=True)
    posts = requests.get(
        "http://localhost:3000/api/posts?parseData=false", headers=headers)
    content = json.loads(posts.content)["posts"]
    save_json_documents(content, out)


def upload_posts_to_db():

    user = os.getenv('MONGODB_ROOT_USER')
    password = os.getenv('MONGODB_ROOT_PASSWORD')
    uri = f"mongodb://{user}:{password}@localhost:27017/"

    # Staging
    for f_path in (Path(os.path.abspath(__file__)).parent /
                   "backup" / "posts").glob("*.json"):
        with open(f_path, 'r') as file:
            json_dict = json.load(file)

        json_dict = json_dict["data"]
        json_dict["_id"] = f_path.stem
        _upload_to_mongodb(json_dict, "data-staging", "posts", uri)


def upload_overview_to_db():

    user = os.getenv('MONGODB_ROOT_USER')
    password = os.getenv('MONGODB_ROOT_PASSWORD')
    uri = f"mongodb://{user}:{password}@localhost:27017/"

    # Staging
    f_path = Path(os.path.abspath(__file__)).parent / \
        "backup" / "overview" / "document.json"

    with open(f_path, 'r') as file:
        json_list = json.load(file)

    json_dict = {"_id": "overview", "values": json_list}
    _upload_to_mongodb(json_dict, "data-staging", "administrative", uri)


def upload_tags_to_db():

    user = os.getenv('MONGODB_ROOT_USER')
    password = os.getenv('MONGODB_ROOT_PASSWORD')
    uri = f"mongodb://{user}:{password}@localhost:27017/"

    # Staging
    f_path = Path(os.path.abspath(__file__)).parent / \
        "backup" / "tags" / "document.json"

    with open(f_path, 'r') as file:
        json_list = json.load(file)

    json_dict = {"_id": "tags", "values": json_list}
    _upload_to_mongodb(json_dict, "data-staging", "administrative", uri)


def _upload_to_mongodb(json_dict, db_name, collection_name, uri="mongodb://localhost:27017/"):

    # Connect to the MongoDB server
    client = MongoClient(uri)

    # Access the database
    db = client[db_name]

    # Access the collection
    collection = db[collection_name]

    # Insert the JSON documents into the collection
    result = collection.insert_one(json_dict)
    print(
        f'Successfully inserted document into the "{collection_name}" collection with id {result.inserted_id}.')

    # Close the connection
    client.close()


if __name__ == "__main__":
    # save_overview()
    # save_tags()
    # save_posts()
    # upload_posts_to_db()
    # upload_overview_to_db()
    # upload_tags_to_db()
    pass
