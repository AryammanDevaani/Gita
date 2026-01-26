import json
import random
import os

def main():
    # Load Gita Data
    try:
        with open('gita.json', 'r', encoding='utf-8') as f:
            data = json.load(f)
    except FileNotFoundError:
        print("Error: gita.json not found.")
        return

    # Flatten the data structure to get a list of verses
    all_verses = []
    if isinstance(data, list):
        all_verses = data
    elif isinstance(data, dict):
        for key, value in data.items():
            if isinstance(value, list):
                all_verses.extend(value)

    if not all_verses:
        print("Error: No verses found.")
        return

    verse = random.choice(all_verses)

    # 1. Extract Standard Data
    verse_num = verse.get('verse', verse.get('verse_number', 'Unknown'))
    chapter_num = verse.get('chapter', verse.get('chapter_number', 'Unknown'))
    sanskrit = verse.get('sanskrit', verse.get('text', ''))
    english = verse.get('english', verse.get('translation', ''))

    # 2. Extract Caption Candidates
    instagram_purport = verse.get('instagramPurport', '').strip()
    threads_english = verse.get('threadsEnglish', '').strip()

    # 3. Determine Caption Text (Priority: Insta Purport -> Threads English -> Standard English)
    if instagram_purport:
        caption_body = instagram_purport
    elif threads_english:
        caption_body = threads_english
    else:
        caption_body = english

    # 4. Construct the Final Formatted Caption
    final_caption = (f"{caption_body}\n\n"
        f"For suggestions, corrections, or to contribute email: support@bhgvd.com.")

    # 5. Save Data
    output_data = {
        "chapter": chapter_num,
        "verse": verse_num,
        "sanskrit": sanskrit,
        "english": english, # Image uses standard English
        "caption": final_caption
    }

    with open('todays_verse.json', 'w', encoding='utf-8') as f:
        json.dump(output_data, f, indent=2, ensure_ascii=False)
    
    print(f"Selected Chapter {chapter_num} Verse {verse_num}")

if __name__ == "__main__":
    main()