import json
import os

HISTORY_FILE = 'history.json'

def main():
    # 1. Load Data
    data = {"history": [], "counter": 1}
    if os.path.exists(HISTORY_FILE):
        with open(HISTORY_FILE, 'r') as f:
            loaded = json.load(f)
            if isinstance(loaded, dict):
                data = loaded
            elif isinstance(loaded, list):
                data["history"] = loaded

    # 2. Read Counter & Determine Mode
    counter = data.get("counter", 1)
    
    mode_map = {
        1: "english",
        2: "hindi",
        3: "gujarati"
    }
    
    current_mode = mode_map.get(counter, "english")
    print(f"🔄 Counter is {counter} -> Mode: {current_mode.upper()}")

    # 3. Output to GitHub Actions
    with open(os.environ['GITHUB_OUTPUT'], 'a') as fh:
        print(f"mode={current_mode}", file=fh)

    # 4. Increment Counter for NEXT run
    next_counter = counter + 1
    if next_counter > 3:
        next_counter = 1
    
    data["counter"] = next_counter

    # 5. Save Change
    with open(HISTORY_FILE, 'w') as f:
        json.dump(data, f)

if __name__ == "__main__":
    main()
