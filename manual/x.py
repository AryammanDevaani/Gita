import json
import random

def get_random_gita_verse(file_path):
    try:
        # Load the Gita data from the JSON file
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        # Select a random entry from the list
        verse_data = random.choice(data)
        
        # Extract required fields
        # Note: 'chapter' and 'verse' provide the verse number context
        verse_id = f"{verse_data.get('chapter')}.{verse_data.get('verse')}"
        sanskrit_verse = verse_data.get('sanskrit', '')
        tweet_english = verse_data.get('tweetEnglish', '') #
        
        # Print according to the requested format
        print(verse_id)
        print()
        print(sanskrit_verse)
        print()
        print(tweet_english)
        print()
        print("gita.bhgvd.com")
        
    except FileNotFoundError:
        print(f"Error: The file '{file_path}' was not found.")
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    # Ensure the path matches the location of your gita.json file
    get_random_gita_verse('gita.json')