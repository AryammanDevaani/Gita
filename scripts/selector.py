import json
import random
import os

HISTORY_FILE = 'history.json'
SELECTION_FILE = 'selection.json'
GITA_FILE = 'gita.json'

def main():
    # 1. Load the GITA verses
    try:
        with open(GITA_FILE, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except FileNotFoundError:
        print(f"Error: {GITA_FILE} not found.")
        return

    # Flatten the data structure if needed
    all_verses = []
    if isinstance(data, list):
        all_verses = data
    elif isinstance(data, dict):
        for key, value in data.items():
            if isinstance(value, list):
                all_verses.extend(value)

    # 2. Load History (Verses already posted)
    # 2. Load History (Updated for Counter Support)
    history_data = {"history": [], "counter": 1} # Default structure
    if os.path.exists(HISTORY_FILE):
        with open(HISTORY_FILE, 'r', encoding='utf-8') as f:
            try:
                loaded = json.load(f)
                # If it's the old list format, migrate it to the new dict format
                if isinstance(loaded, list):
                    history_data["history"] = loaded
                elif isinstance(loaded, dict):
                    history_data = loaded
            except json.JSONDecodeError:
                pass
    
    # Work with just the list part for the rest of this script
    history = history_data.get("history", [])

    # 3. Filter out verses that are already in history
    # We create a unique signature for each verse: "Chapter:Verse"
    history_set = set(history)
    available_verses = []
    
    for v in all_verses:
        sig = f"{v.get('chapter')}:{v.get('verse')}"
        if sig not in history_set:
            available_verses.append(v)

    # 4. Check if we have run out of verses
    if not available_verses:
        print("All verses have been covered! Resetting history...")
        history = []
        available_verses = all_verses
        # Optional: Send an email alert here that cycle is complete

    # 5. Pick a random verse from the AVAILABLE list
    selected_verse = random.choice(available_verses)
    selected_sig = f"{selected_verse.get('chapter')}:{selected_verse.get('verse')}"

    print(f"Selected for today: Chapter {selected_verse.get('chapter')}, Verse {selected_verse.get('verse')}")

    # 6. Save the Selection (for other scripts to read)
    with open(SELECTION_FILE, 'w', encoding='utf-8') as f:
        json.dump({
            "chapter": selected_verse.get('chapter'),
            "verse": selected_verse.get('verse')
        }, f)

    # 7. Update History
    # 7. Update History
    history.append(selected_sig)
    history_data["history"] = history  # Update the list inside the main object
    
    with open(HISTORY_FILE, 'w', encoding='utf-8') as f:
        json.dump(history_data, f)

if __name__ == "__main__":

    main()
