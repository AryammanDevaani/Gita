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
    
    # Gujarati specific fields
    image_text = verse.get('translationGujarati', verse.get('gujarati', ''))
    transliteration = verse.get('gujaratiTransliteration', '').strip()
    wbw_meaning = verse.get('gujaratiWBW', '').strip()
    explanation = verse.get('gujaratiExplain', '').strip()

    caption_parts = [
        f"અધ્યાય {chapter_num}, શ્લોક {verse_num}",
        transliteration,
        wbw_meaning,
        explanation,
        f"corrections@bhgvd.com"
    ]
    final_caption = "\n\n".join([part for part in caption_parts if part])

    output_data = {
        "chapter": chapter_num,
        "verse": verse_num,
        "sanskrit": sanskrit,
        "image_text": image_text,
        "caption": final_caption
    }

    with open('content_data_gu.json', 'w', encoding='utf-8') as f:
        json.dump(output_data, f, indent=2, ensure_ascii=False)
    
    print(f"Curated Gujarati: Chapter {chapter_num} Verse {verse_num}")

if __name__ == "__main__":
    main()