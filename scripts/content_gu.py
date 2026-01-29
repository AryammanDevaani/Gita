import json
import os

# 1. Helper function for Gujarati Numerals
def to_gujarati_numerals(n):
    return str(n).translate(str.maketrans("0123456789", "૦૧૨૩૪૫૬૭૮૯"))

def main():
    # 2. Load Gita Data
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

    # 3. Master Selection Logic
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

    # 4. Extract & Convert Data
    verse_num = verse.get('verse', 'Unknown')
    chapter_num = verse.get('chapter', 'Unknown')
    sanskrit = verse.get('sanskrit', '')

    # Convert to Gujarati Numerals
    chapter_gu = to_gujarati_numerals(chapter_num)
    verse_gu = to_gujarati_numerals(verse_num)

    # Gujarati Text Fields
    image_text = verse.get('translationGujarati', verse.get('gujarati', ''))
    transliteration = verse.get('gujaratiTransliteration', '').strip()
    wbw_meaning = verse.get('gujaratiWBW', '').strip()
    explanation = verse.get('gujaratiExplain', '').strip()

    # 5. Structure Data (No Caption Building)
    
    output_data = {
        # EXISTING FIELDS (Required for image_gu.js)
        "sanskrit": sanskrit,
        "image_text": image_text,

        # NEW FIELDS (For Carousel & Dynamic Captions)
        "header": f"અધ્યાય {chapter_gu}, શ્લોક {verse_gu}",
        "transliteration": transliteration,
        "wbw": wbw_meaning,
        "explanation": explanation
    }

    # 6. Save
    with open('content_data_gu.json', 'w', encoding='utf-8') as f:
        json.dump(output_data, f, indent=2, ensure_ascii=False)
        
    print(f"Curated Gujarati: Chapter {chapter_num} Verse {verse_num}")

if __name__ == "__main__":
    main()