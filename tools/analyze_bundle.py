import re
from pathlib import Path

BUNDLE_PATH = Path(".tmp/app_bundle.js")

def analyze():
    if not BUNDLE_PATH.exists():
        print("Bundle file not found!")
        return

    content = BUNDLE_PATH.read_text(encoding="utf-8", errors="ignore")
    print(f"File size: {len(content)} chars")

    # Regex patterns
    patterns = {
        "collections_dot": r'\.collection\s*\(\s*["\']([^"\']+)["\']',
        "collections_func": r'collection\s*\(\s*[^,]+,\s*["\']([^"\']+)["\']',
        "docs": r'\.doc\s*\(\s*["\']([^"\']+)["\']',
        "fields_assignment": r'\.([a-zA-Z0-9_]+)\s*=',
        "json_keys": r'["\']([a-zA-Z0-9_]+)["\']\s*:',
        "possible_resultado": r'["\']resultado["\']',
        "firebase_methods": r'(where|orderBy|limit|startAfter)\(',
        "hex_colors": r'#(?:[0-9a-fA-F]{3}){1,2}\b'
    }

    print("\n--- MATCHES ---")
    for name, pattern in patterns.items():
        matches = re.findall(pattern, content)
        unique_matches = list(set(matches))
        print(f"\n[{name}] Found {len(unique_matches)} unique:")
        # Filter potentially listing too many minified vars (1-2 chars)
        filtered = [m for m in unique_matches if len(m) > 2]
        print(filtered[:50]) # Print first 50

    # Look for context around "resultado"
    if "resultado" in content:
        idx = content.find("resultado")
        start = max(0, idx - 100)
        end = min(len(content), idx + 100)
        print(f"\n--- CONTEXT: resultado ---\n...{content[start:end]}...")

if __name__ == "__main__":
    analyze()
