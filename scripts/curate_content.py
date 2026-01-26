import json
import random
import os

def main():
    try:
        with open('gita.json', 'r', encoding='utf-8') as f:
            data = json.load(f)
    except FileNotFoundError:
        print("Error: gita.json not found.")
        return

    all_verses = []
    if isinstance(data, list):
        all_verses = data
    elif isinstance(data, dict):
        for key, value in data.items():
            if isinstance(value, list):
                all_verses.extend(value)

    if not all_verses:
        return

    verse = random.choice(all_verses)

    # Extracting specific fields
    verse_num = verse.get('verse', 'Unknown')
    chapter_num = verse.get('chapter', 'Unknown')
    sanskrit = verse.get('sanskrit', '')
    
    # Requirement: Image uses tweetEnglish
    image_text = verse.get('tweetEnglish', verse.get('english', ''))

    # Caption Hierarchy
    insta_purport = verse.get('instagramPurport', '').strip()
    threads_text = verse.get('threadsEnglish', '').strip()
    fallback_text = verse.get('english', '').strip()

    if insta_purport:
        caption_body = insta_purport
    elif threads_text:
        caption_body = threads_text
    else:
        caption_body = fallback_text

    final_caption = (
        f"Chapter {chapter_num}, Verse {verse_num}\n\n"
        f"{caption_body}"
    )

    output_data = {
        "chapter": chapter_num,
        "verse": verse_num,
        "sanskrit": sanskrit,
        "image_english": image_text,
        "caption": final_caption
    }

    with open('session_data.json', 'w', encoding='utf-8') as f:
        json.dump(output_data, f, indent=2, ensure_ascii=False)
    
    print(f"Curated Chapter {chapter_num} Verse {verse_num}")

if __name__ == "__main__":
    main()