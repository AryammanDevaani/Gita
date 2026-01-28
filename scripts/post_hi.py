import requests
import json
import os
import time

USER_ID = os.environ.get('IG_USER_ID') 
TOKEN = os.environ.get('META_TOKEN')

with open('content_data_hi.json', 'r') as f:
    data = json.load(f)

IMG_URL = f"https://raw.githubusercontent.com/aryammandevaani/gita/main/image_hi.png?t={int(time.time())}"
TEXT = data.get('caption')

def publish():
    print(f"🚀 Pinging Instagram (Hindi) for image: {IMG_URL}")
    url = f"https://graph.facebook.com/v21.0/{USER_ID}/media"
    payload = {'image_url': IMG_URL, 'caption': TEXT, 'access_token': TOKEN}
    r = requests.post(url, data=payload)
    res = r.json()
    
    if r.status_code != 200:
        print(f"❌ Failed: {res}")
        return

    cid = res.get('id')
    print(f"✅ Container {cid} created.")

    for _ in range(10): 
        time.sleep(5)
        status_url = f"https://graph.facebook.com/v21.0/{cid}?fields=status_code,status&access_token={TOKEN}"
        status_res = requests.get(status_url).json()
        status_code = status_res.get('status_code')
        if status_code == 'FINISHED':
            break
        elif status_code == 'ERROR':
            return
    else:
        return

    pub_url = f"https://graph.facebook.com/v21.0/{USER_ID}/media_publish"
    requests.post(pub_url, data={'creation_id': cid, 'access_token': TOKEN})
    print("🎉 SUCCESS: Hindi Post is live!")

if __name__ == "__main__":
    publish()