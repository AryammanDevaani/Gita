import requests
import json
import os
import time

USER_ID = os.environ.get('IG_USER_ID')
TOKEN = os.environ.get('META_TOKEN')

with open('session_data.json', 'r') as f:
    data = json.load(f)

# Use your repository path here
IMG_URL = f"https://raw.githubusercontent.com/aryammandevaani/gita/main/final_render.png?t={int(time.time())}"
TEXT = data.get('caption')

def publish():
    url = f"https://graph.facebook.com/v21.0/{USER_ID}/media"
    payload = {'image_url': IMG_URL, 'caption': TEXT, 'access_token': TOKEN}
    
    r = requests.post(url, data=payload)
    if r.status_code != 200:
        print(f"Error: {r.text}")
        return

    cid = r.json().get('id')
    print(f"Container {cid} created. Processing...")
    time.sleep(30)

    pub_url = f"https://graph.facebook.com/v21.0/{USER_ID}/media_publish"
    r2 = requests.post(pub_url, data={'creation_id': cid, 'access_token': TOKEN})
    
    if r2.status_code == 200:
        print("Post live on Instagram.")
    else:
        print(f"Publish error: {r2.text}")

if __name__ == "__main__":
    publish()