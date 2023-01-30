from flask import Flask, request
import requests
import os
from dotenv import load_dotenv
load_dotenv()
from flask_cors import CORS
from linkpreview import Link, LinkPreview, LinkGrabber

app = Flask(__name__)
CORS(app)

@app.route("/")
def index():
    return "Server is running"

@app.route("/peekalink")
def peekalink_api_call():
    # Get queryparams and create out object
    args = request.args
    res = {"success" : 1, "link": args.get("url")}
    
    # Make API request to external API
    api_key = os.environ.get("PEEKALINK_API_KEY")
    api_response = requests.post(
        "https://api.peekalink.io/",
        headers={"X-API-Key": api_key},
        data={"link": args.get("url")},
    ).json()

    # create object with wanted data
    meta = {"title": api_response["title"], "description": api_response["description"], "image": api_response["image"]}
    res["meta"] = meta
    
    return res

@app.route("/fetchLinkPreview")
def link_preview():
# Get queryparams and create out object
    args = request.args
    print(args.get("url"))
    res = {"success" : 1, "link": args.get("url")}
    
    url = args.get("url")
    grabber = LinkGrabber(
        initial_timeout=20,
        maxsize=10485760, # Set default from 1mb to 10mb
        receive_timeout=10,
        chunk_size=1024,
    )
    content, url = grabber.get_content(url)
    link = Link(url, content)
    preview = LinkPreview(link, parser="lxml")

    # create object with wanted data
    meta = {"title": preview.title, "description": preview.description, "image": preview.image}
    res["meta"] = meta

    return res


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3001)
