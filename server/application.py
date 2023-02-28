import os
import requests
from flask import Flask, request
from dotenv import load_dotenv
load_dotenv()
from bs4 import BeautifulSoup
from flask_cors import CORS
from linkpreview import Link, LinkGrabber, LinkPreview

application = Flask(__name__)
CORS(application)

@application.route("/")
def index():
    return "Server is running"


"""
Simple version
"""
@application.route("/fetchLinkPreview")
def link_preview():
    # Get queryparams and create out object
    args = request.args
    url = args.get("url")
    res = {"success" : 1, "link": url}
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


"""
Advanced version
"""
def _get_title(html):
    """Scrape page title."""
    title = None
    if html.find("meta", property="og:title"):
        title = html.find("meta", property="og:title").get('content')
    elif html.find("meta", property="twitter:title"):
        title = html.find("meta", property="twitter:title").get('content')
    elif html.title.string:
        title = html.title.string
    elif html.find("h1"):
        title = html.find("h1").string
    return title


def _get_description(html):
    """Scrape page description."""
    description = None
    if html.find("meta", property="description"):
        description = html.find("meta", property="description").get('content')
    elif html.find("meta", property="og:description"):
        description = html.find("meta", property="og:description").get('content')
    elif html.find("meta", property="twitter:description"):
        description = html.find("meta", property="twitter:description").get('content')
    elif html.find("p"):
        description = html.find("p").contents
    return description


def _get_image(html):
    """Scrape share image."""
    image = None
    if html.find("meta", property="image"):
        image = html.find("meta", property="image").get('content')
    elif html.find("meta", property="og:image"):
        image = html.find("meta", property="og:image").get('content')
    elif html.find("meta", property="twitter:image"):
        image = html.find("meta", property="twitter:image").get('content')
    elif html.find("img", src=True):
        image = html.find_all("img").get('src')
    return image


@application.route("/advancedFetchLinkPreview")
def advanced_link_preview():
    # Get url
    args = request.args
    url = args.get("url")
    
    # Define headers for successful scraping
    headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '3600',
        'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:52.0) Gecko/20100101 Firefox/52.0'
    }

    # Perform scraping
    req = requests.get(url, headers)
    html = BeautifulSoup(req.content, 'html.parser')
    meta = {
       'title': _get_title(html),
       'description': _get_description(html),
       'image': _get_image(html),
    }

    # Create object with wanted data
    res = {"success" : 1, "link": url, "meta": meta}

    return res


if __name__ == '__main__':
    application.run(host='0.0.0.0', port=8000)