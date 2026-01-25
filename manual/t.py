import json
import random

def get_random_verse(file_path):
    try:
        # Load the Gita JSON data
        with open(file_path, 'r', encoding='utf-8') as file:
            data = json.load(file)
        
        # Select a random entry from the list
        entry = random.choice(data)
        
        # Extract required fields
        verse_num = f"{entry.get('chapter')}.{entry.get('verse')}"
        sanskrit = entry.get('sanskrit', '')
        threads_english = entry.get('threadsEnglish', '')
        
        # Format and Print
        print(verse_num)
        print()  # Empty line
        print(sanskrit)
        print()  # Empty line
        print(threads_english)
        print()  # Empty line
        print("gita.bhgvd.com")

    except FileNotFoundError:
        print("Error: gita.json not found.")
    except Exception as e:
        print(f"An error occurred: {e}")

# Run the function
get_random_verse('gita.json')