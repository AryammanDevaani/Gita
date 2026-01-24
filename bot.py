import tweepy
import json
import os
import sys
import random

# --- CONFIGURATION (LOADED FROM GITHUB SECRETS) ---
# These names MUST match the names you give your GitHub Secrets exactly.
API_KEY = os.environ.get("API_KEY")
API_SECRET = os.environ.get("API_SECRET")
BEARER_TOKEN = os.environ.get("BEARER_TOKEN")
ACCESS_TOKEN = os.environ.get("ACCESS_TOKEN")
ACCESS_SECRET = os.environ.get("ACCESS_SECRET")

# --- FILE PATHS ---
JSON_FILE = 'gita.json'

def get_twitter_conn_v2():
    """Connect to Twitter API v2 using the secrets provided by GitHub"""
    client = tweepy.Client(
        bearer_token=BEARER_TOKEN,
        consumer_key=API_KEY,
        consumer_secret=API_SECRET,
        access_token=ACCESS_TOKEN,
        access_token_secret=ACCESS_SECRET
    )
    return client

def main():
    # 1. Load the Gita Data
    if not os.path.exists(JSON_FILE):
        print("Error: gita.json not found.")
        sys.exit(1)

    with open(JSON_FILE, 'r', encoding='utf-8') as f:
        data = json.load(f)

    # 2. Select a Random Verse
    verse = random.choice(data)
    
    # 3. Format the Tweet (Sanskrit - Gap - English - Gap - Link)
    tweet_text = f"{verse['sanskrit']}\n\n{verse['tweetEnglish']}\n\ngita.bhgvd.com"

    print(f"Posting Random Verse: {verse['chapter']}.{verse['verse']}...")

    # 4. Post to Twitter
    try:
        client = get_twitter_conn_v2()
        client.create_tweet(text=tweet_text)
        print(f"✅ SUCCESS! Posted to Twitter.")
    except Exception as e:
        # If this fails with 401, check your GitHub Secrets again!
        print(f"❌ ERROR: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()