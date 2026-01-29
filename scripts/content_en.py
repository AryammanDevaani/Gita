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

    # --- REPLACING RANDOM SELECTION WITH MASTER SELECTION ---
    try:
        with open('selection.json', 'r', encoding='utf-8') as f:
            sel = json.load(f)
            target_chap = sel.get('chapter')
            target_ver = sel.get('verse')
            
        # Find the specific verse in our big list
        verse = next((v for v in all_verses if v.get('chapter') == target_chap and v.get('verse') == target_ver), None)
        
        if not verse:
            print(f"Error: Selected verse {target_chap}:{target_ver} not found in gita.json")
            return
            
    except FileNotFoundError:
        print("Error: selection.json not found. Run selector.py first.")
        return
    # --------------------------------------------------------
    
    verse_num = verse.get('verse', 'Unknown')
    chapter_num = verse.get('chapter', 'Unknown')
    sanskrit = verse.get('sanskrit', '')

    # Requirement: Image uses tweetEnglish
    image_text = verse.get('translationEnglish', verse.get('english', ''))

    # --- NEW CAPTION LOGIC ---
    # We attempt to fetch the organized fields first.
    # If they are missing (e.g., empty string), we might want to fallback or leave them blank.
    transliteration = verse.get('englishTransliteration', '').strip()
    wbw_meaning = verse.get('englishWBW', '').strip()
    explanation = verse.get('englishExplain', '').strip()

    # Construct the final caption with the requested spacing.
    # You requested "empty line" then "empty line", which usually implies a significant gap.
    # \n = new line. \n\n = one empty line in between. \n\n\n = two empty lines in between.
    # Below uses \n\n (standard paragraph break). If you want larger gaps, change to \n\n\n.
    
    caption_parts = [
        f"Chapter {chapter_num}, Verse {verse_num}",  # Verse Number
        transliteration,                               # Transliteration
        wbw_meaning,                                   # WBW Meaning
        explanation,
        f"corrections@bhgvd.com"                                    # Explanation
    ]
    
    # Filter out empty parts (in case a verse lacks one section) to avoid weird extra spacing
    # and join them with double newlines
    final_caption = "\n\n".join([part for part in caption_parts if part])

    # -------------------------

    output_data = {
        "chapter": chapter_num,
        "verse": verse_num,
        "sanskrit": sanskrit,
        "image_english": image_text,
        "caption": final_caption
    }

    with open('content_data_en.json', 'w', encoding='utf-8') as f:
        json.dump(output_data, f, indent=2, ensure_ascii=False)
    
    print(f"Curated Chapter {chapter_num} Verse {verse_num}")

if __name__ == "__main__":
    main()