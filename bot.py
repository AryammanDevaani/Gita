import tweepy
import json
import os
import sys
import random

# --- CONFIGURATION (LOADED FROM GITHUB SECRETS) ---
API_KEY = os.environ.get("API_KEY")
API_SECRET = os.environ.get("API_SECRET")
BEARER_TOKEN = os.environ.get("BEARER_TOKEN")
ACCESS_TOKEN = os.environ.get("ACCESS_TOKEN")
ACCESS_SECRET = os.environ.get("ACCESS_SECRET")

# --- FILE PATHS ---
JSON_FILE = 'gita.json'

def get_twitter_conn_v2():
    client = tweepy.Client(
        bearer_token=BEARER_TOKEN,
        consumer_key=API_KEY,
        consumer_secret=API_SECRET,
        access_token=ACCESS_TOKEN,
        access_token_secret=ACCESS_SECRET
    )
    return client

def main():
    if not os.path.exists(JSON_FILE):
        print("Error: gita.json not found.")
        sys.exit(1)

    with open(JSON_FILE, 'r', encoding='utf-8') as f:
        data = json.load(f)

    # --- RANDOM SELECTION ---
    verse = random.choice(data)
    
    # Format: Sanskrit - Gap - English - Gap - Link
    tweet_text = f"{verse['sanskrit']}\n\n{verse['tweetEnglish']}\n\ngita.bhgvd.com"

    print(f"Posting Random Verse: {verse['chapter']}.{verse['verse']}...")

    try:
        client = get_twitter_conn_v2()
        client.create_tweet(text=tweet_text)
        print(f"✅ SUCCESS! Posted.")
    except Exception as e:
        print(f"❌ ERROR: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()