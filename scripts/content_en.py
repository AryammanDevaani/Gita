import json
import os

def main():
    # 1. Load Gita Data
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

    # 2. Master Selection Logic (Reads from selector.py)
    try:
        with open('selection.json', 'r', encoding='utf-8') as f:
            sel = json.load(f)
            target_chap = sel.get('chapter')
            target_ver = sel.get('verse')
            
        verse = next((v for v in all_verses if v.get('chapter') == target_chap and v.get('verse') == target_ver), None)
        
        if not verse:
            print(f"Error: Selected verse {target_chap}:{target_ver} not found.")
            return
            
    except FileNotFoundError:
        print("Error: selection.json not found. Run selector.py first.")
        return

    # 3. Extract Data (MOVED UP - Must happen before using variables!)
    verse_num = verse.get('verse', 'Unknown')
    chapter_num = verse.get('chapter', 'Unknown')
    sanskrit = verse.get('sanskrit', '')
    
    # English specific fields
    image_text = verse.get('tweetEnglish', verse.get('translation', ''))
    
    # Optional fields for caption
    transliteration = verse.get('englishTransliteration', '')
    word_meanings = verse.get('wordMeanings', '')
    explanation = verse.get('englishExplain', verse.get('purport', ''))

    # 4. Build Caption
    caption_parts = [
        f"Chapter {chapter_num}, Verse {verse_num}",
        # You can uncomment these if you want them in the caption:
        # transliteration,
        # word_meanings,
        explanation,
        "corrections@bhgvd.com"
    ]
    
    final_caption = "\n\n".join([str(part).strip() for part in caption_parts if part])

    output_data = {
        "chapter": chapter_num,
        "verse": verse_num,
        "sanskrit": sanskrit,
        "image_text": image_text,
        "caption": final_caption
    }

    # 5. Save
    with open('content_data_en.json', 'w', encoding='utf-8') as f:
        json.dump(output_data, f, indent=2, ensure_ascii=False)
    
    print(f"Curated English: Chapter {chapter_num} Verse {verse_num}")

if __name__ == "__main__":
    main()