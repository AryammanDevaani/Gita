import tweepy
import json
import os
import sys
import random

# --- CONFIGURATION (LOADED FROM GITHUB SECRETS) ---
API_KEY = os.environ.get("my5v8j5C6JQfxgcIhGWdcXGvd")
API_SECRET = os.environ.get("APITNXn7xjPhOyGA7YvfRkJVVSwckcJKE5U3RS4UFbmmFtJ6SaGw5_SECRET")
BEARER_TOKEN = os.environ.get("AAAAAAAAAAAAAAAAAAAAJrU7AEAAAAAQ%2BY%2B%2BLOOhwUyD%2FDUBOusxLvvO5w%3D5rZfgTOEua35shf3GKAeQscSwn28nK9MSf22wIwpbRr9NoOcpL")
ACCESS_TOKEN = os.environ.get("2014613616419602435-pM84ckiJ1zNouLj0bMQwsO6kkOjaXu")
ACCESS_SECRET = os.environ.get("ACCES3kNliu8lBOyqoefYywgzA8ipj4tcafHcGvjCrN8tQqZJYS_SECRET")

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