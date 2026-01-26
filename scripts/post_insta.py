import requests
import json
import os
import time

IG_USER_ID = os.environ.get('IG_USER_ID')
ACCESS_TOKEN = os.environ.get('META_TOKEN')

# Load Data
try:
    with open('todays_verse.json', 'r') as f:
        data = json.load(f)
except FileNotFoundError:
    print("Error: todays_verse.json not found.")
    exit(1)

# Image URL (Using your username)
IMAGE_URL = f"https://raw.githubusercontent.com/aryammandevaani/gita/main/daily_post.png?t={int(time.time())}"
CAPTION = data.get('caption', 'Daily Gita Verse')

def post_to_instagram():
    print(f"Initializing Instagram Upload for ID: {IG_USER_ID}")
    url = f"https://graph.facebook.com/v21.0/{IG_USER_ID}/media"
    
    # 1. Create Container
    payload = {
        'image_url': IMAGE_URL,
        'caption': CAPTION,
        'access_token': ACCESS_TOKEN
    }
    r = requests.post(url, data=payload)
    if r.status_code != 200:
        print("Error Creating Container:", r.text)
        return

    container_id = r.json().get('id')
    print(f"Container Created: {container_id}")
    
    # Wait for processing
    time.sleep(15)

    # 2. Publish Container
    publish_url = f"https://graph.facebook.com/v21.0/{IG_USER_ID}/media_publish"
    pub_payload = {
        'creation_id': container_id,
        'access_token': ACCESS_TOKEN
    }
    r2 = requests.post(publish_url, data=pub_payload)
    if r2.status_code == 200:
        print("Success! Post published to Instagram.")
    else:
        print("Error Publishing:", r2.text)

if __name__ == "__main__":
    if not IG_USER_ID or not ACCESS_TOKEN:
        print("Error: Missing GitHub Secrets.")
    else:
        post_to_instagram()