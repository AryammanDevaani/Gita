import requests
import json
import os
import time

USER_ID = os.environ.get('IG_USER_ID')
TOKEN = os.environ.get('META_TOKEN')

with open('content_data_en.json', 'r') as f:
    data = json.load(f)

# Added a cache-buster timestamp to ensure Instagram doesn't grab an old version
IMG_URL = f"https://raw.githubusercontent.com/aryammandevaani/gita/main/image_en.png?t={int(time.time())}"
TEXT = data.get('caption')

def publish():
    print(f"🚀 Pinging Instagram for image: {IMG_URL}")
    url = f"https://graph.facebook.com/v21.0/{USER_ID}/media"
    payload = {'image_url': IMG_URL, 'caption': TEXT, 'access_token': TOKEN}
    
    r = requests.post(url, data=payload)
    res = r.json()
    
    if r.status_code != 200:
        print(f"❌ Container Creation Failed: {res}")
        return

    cid = res.get('id')
    print(f"✅ Container {cid} created. Checking status...")

    # --- NEW: STATUS CHECK LOOP ---
    for _ in range(10): # Try for 50 seconds
        time.sleep(5)
        status_url = f"https://graph.facebook.com/v21.0/{cid}?fields=status_code,status&access_token={TOKEN}"
        status_res = requests.get(status_url).json()
        status_code = status_res.get('status_code')
        
        print(f"⏳ Current Status: {status_code}")
        
        if status_code == 'FINISHED':
            break
        elif status_code == 'ERROR':
            print(f"❌ Meta failed to download the image: {status_res.get('status')}")
            return
    else:
        print("❌ Timeout: Image processing took too long.")
        return

    # --- PUBLISH ONLY IF FINISHED ---
    pub_url = f"https://graph.facebook.com/v21.0/{USER_ID}/media_publish"
    r2 = requests.post(pub_url, data={'creation_id': cid, 'access_token': TOKEN})
    
    if r2.status_code == 200:
        print("🎉 SUCCESS: Post is live!")
    else:
        print(f"❌ Publish error: {r2.text}")

if __name__ == "__main__":
    publish()