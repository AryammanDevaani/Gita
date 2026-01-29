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

    verse_num = verse.get('verse', 'Unknown')
    chapter_num = verse.get('chapter', 'Unknown')
    sanskrit = verse.get('sanskrit', '')
    
    # Hindi specific fields
    image_text = verse.get('translationHindi', verse.get('hindi', ''))
    transliteration = verse.get('hindiTransliteration', '').strip()
    wbw_meaning = verse.get('hindiWBW', '').strip()
    explanation = verse.get('hindiExplain', '').strip()

    caption_parts = [
        f"अध्याय {chapter_num}, श्लोक {verse_num}",
        transliteration,
        wbw_meaning,
        explanation,
        f"corrections@gita.bhgvd.com"
    ]
    
    final_caption = "\n\n".join([part for part in caption_parts if part])

    output_data = {
        "chapter": chapter_num,
        "verse": verse_num,
        "sanskrit": sanskrit,
        "image_text": image_text,
        "caption": final_caption
    }

    # Save to Hindi specific file
    with open('content_data_hi.json', 'w', encoding='utf-8') as f:
        json.dump(output_data, f, indent=2, ensure_ascii=False)
    
    print(f"Curated Hindi: Chapter {chapter_num} Verse {verse_num}")

if __name__ == "__main__":
    main()