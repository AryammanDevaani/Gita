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
    print("❌ Error: todays_verse.json not found.")
    exit(1)

# Ensure the URL is clean
IMAGE_URL = f"https://raw.githubusercontent.com/aryammandevaani/gita/main/daily_post.png?t={int(time.time())}"
CAPTION = data.get('caption', 'Daily Gita Verse')

def post_to_instagram():
    print(f"🚀 Starting Upload for ID: {IG_USER_ID}")
    print(f"🖼️ Image URL: {IMAGE_URL}")
    
    # 1. Create Media Container
    url = f"https://graph.facebook.com/v21.0/{IG_USER_ID}/media"
    payload = {
        'image_url': IMAGE_URL,
        'caption': CAPTION,
        'access_token': ACCESS_TOKEN
    }
    
    r = requests.post(url, data=payload)
    response_data = r.json()
    
    if r.status_code != 200:
        print("❌ FAILED AT CONTAINER CREATION")
        print(f"Status Code: {r.status_code}")
        print(f"Response: {json.dumps(response_data, indent=2)}")
        return

    container_id = response_data.get('id')
    print(f"✅ Container Created: {container_id}")
    
    # Wait longer for Meta to process high-res Puppeteer images
    print("⏳ Waiting 30 seconds for Meta to process the image...")
    time.sleep(30)

    # 2. Publish Media
    publish_url = f"https://graph.facebook.com/v21.0/{IG_USER_ID}/media_publish"
    pub_payload = {
        'creation_id': container_id,
        'access_token': ACCESS_TOKEN
    }
    
    r2 = requests.post(publish_url, data=pub_payload)
    pub_response = r2.json()
    
    if r2.status_code == 200:
        print("🎉 SUCCESS! Post is live on Instagram.")
    else:
        print("❌ FAILED AT PUBLISHING")
        print(f"Status Code: {r2.status_code}")
        print(f"Response: {json.dumps(pub_response, indent=2)}")

if __name__ == "__main__":
    if not IG_USER_ID or not ACCESS_TOKEN:
        print("❌ Error: Missing IG_USER_ID or META_TOKEN in GitHub Secrets.")
    else:
        post_to_instagram()