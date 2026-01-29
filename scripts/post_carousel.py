import requests
import json
import os
import time
import argparse

# --- CONFIGURATION ---
USER_ID = os.environ.get('IG_USER_ID')
TOKEN = os.environ.get('META_TOKEN')
REPO_BASE_URL = "https://raw.githubusercontent.com/aryammandevaani/gita/main"

# API Endpoints
BASE_API = f"https://graph.facebook.com/v21.0/{USER_ID}"
MEDIA_URL = f"{BASE_API}/media"
PUBLISH_URL = f"{BASE_API}/media_publish"

def load_data():
    """Load all three content data files."""
    data = {}
    for lang in ['en', 'hi', 'gu']:
        try:
            with open(f'content_data_{lang}.json', 'r', encoding='utf-8') as f:
                data[lang] = json.load(f)
        except FileNotFoundError:
            print(f"❌ Error: content_data_{lang}.json not found.")
            exit(1)
    return data

def get_sequence(mode):
    """
    Returns the ordered list of languages based on the mode.
    
    Modes:
    - english: En -> Hi -> Gu
    - hindi:   Hi -> Gu -> En
    - gujarati: Gu -> Hi -> En
    """
    if mode == 'english':
        return ['en', 'hi', 'gu']
    elif mode == 'hindi':
        return ['hi', 'gu', 'en']
    elif mode == 'gujarati':
        return ['gu', 'hi', 'en']
    else:
        print(f"❌ Invalid mode: {mode}")
        exit(1)

def build_caption(data, sequence):
    """Constructs the caption based on the language sequence."""
    # 1. Header (Chapter & Verse) comes from the PRIMARY language (first in sequence)
    primary_lang = sequence[0]
    header = data[primary_lang]['header'] # e.g., "Chapter 9, Verse 8" or Hindi equivalent

    caption_parts = [header]

    # 2. Add Transliteration and WBW for each language in order
    for lang in sequence:
        entry = data[lang]
        # Add a small separator or label if needed, but here we just list them as requested
        # We handle empty fields gracefully
        if entry.get('transliteration'):
            caption_parts.append(entry['transliteration'])
        if entry.get('wbw'):
            caption_parts.append(entry['wbw'])
    
    # 3. Footer
    caption_parts.append("corrections@bhgvd.com")

    # Join with double newlines for spacing
    return "\n\n".join(caption_parts)

def upload_single_image(image_filename):
    """Uploads a single image as a CAROUSEL ITEM and returns its container ID."""
    # Add timestamp to bypass caching
    image_url = f"{REPO_BASE_URL}/{image_filename}?t={int(time.time())}"
    
    print(f"   ⬆️ Uploading item: {image_filename}...")
    
    payload = {
        'image_url': image_url,
        'is_carousel_item': 'true',
        'access_token': TOKEN
    }
    
    r = requests.post(MEDIA_URL, data=payload)
    res = r.json()
    
    if 'id' not in res:
        print(f"   ❌ Failed to upload image {image_filename}: {res}")
        return None
        
    return res['id']

def create_carousel_container(item_ids, caption):
    """Bundles the uploaded items into a single Carousel container."""
    print(f"📦 Bundling {len(item_ids)} images into Carousel...")
    
    payload = {
        'media_type': 'CAROUSEL',
        'children': ','.join(item_ids),
        'caption': caption,
        'access_token': TOKEN
    }
    
    r = requests.post(MEDIA_URL, data=payload)
    res = r.json()
    
    if 'id' not in res:
        print(f"❌ Failed to create carousel container: {res}")
        return None
        
    return res['id']

def publish_container(creation_id):
    """Publishes the container."""
    print(f"🚀 Publishing Container {creation_id}...")
    
    # Wait briefly for processing (Meta needs a moment to process the bundle)
    time.sleep(10)
    
    payload = {
        'creation_id': creation_id,
        'access_token': TOKEN
    }
    
    r = requests.post(PUBLISH_URL, data=payload)
    res = r.json()
    
    if 'id' in res:
        print(f"🎉 SUCCESS: Carousel Post Live! ID: {res['id']}")
    else:
        print(f"❌ Publish Failed: {res}")

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--mode', required=True, choices=['english', 'hindi', 'gujarati'])
    args = parser.parse_args()

    print(f"🎬 Starting Carousel Post - Mode: {args.mode.upper()}")
    
    # 1. Load Data
    data = load_data()
    
    # 2. Determine Sequence
    seq = get_sequence(args.mode)
    print(f"   Sequence: {seq}")

    # 3. Build Caption
    caption = build_caption(data, seq)
    
    # 4. Define Image Order (Verse Image + Explanation Image for each lang)
    # File naming convention: image_{lang}.png and image_{lang}_ex.png
    image_files = []
    for lang in seq:
        image_files.append(f"image_{lang}.png")
        image_files.append(f"image_{lang}_ex.png")
    
    # 5. Upload Individual Images
    item_ids = []
    for img in image_files:
        container_id = upload_single_image(img)
        if container_id:
            item_ids.append(container_id)
        else:
            print("❌ Aborting due to upload failure.")
            return

    # 6. Create Carousel Container
    carousel_id = create_carousel_container(item_ids, caption)
    
    if carousel_id:
        # 7. Publish
        publish_container(carousel_id)

if __name__ == "__main__":
    main()