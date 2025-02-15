import json
from typing import List

def read_json_file(file_path):
    with open(file_path, 'r') as file:
        data = json.load(file)
        for post in data:
            post["data"] = json.loads(post["data"])
    return data

def write_json_file(file_path, json_data):
    with open(file_path, 'w') as file:
        for post in json_data:
            post["data"] = json.dumps(post["data"])
        json.dump(json_data, file)

def perform_changes(json_data: List[dict]):
    new_json_data = json_data.copy()
    for i, post in enumerate(new_json_data):
        for j, item in enumerate(post["data"]["blocks"]):
            # Do your changes here
            pass
    return new_json_data

if __name__ == "__main__":
    file_path = 'data/hosted_production/20250215/posts.json'
    json_data = read_json_file(file_path)
    new_json_data = perform_changes(json_data)
    write_json_file('data/hosted_production/20250215/new_posts.json', new_json_data)

    
    