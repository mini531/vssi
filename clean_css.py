
import re
import os
import sys

try:
    file_path = r'c:\project\vssi\css\style.css'
    if not os.path.exists(file_path):
        print(f"File not found: {file_path}")
        sys.exit(1)

    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Regex to capture content inside /* ... */
    # We look for comments that contain only:
    # - alphanumeric
    # - hyphens
    # - slashes
    # - whitespace
    # And specifically exclude anything with "---" (headers) or other punctuation like comma, dot (sentences).
    
    # Pattern explanation:
    # /\*               Start comment
    # \s*               Whitespace
    # ([a-z0-9\-\/\s]+) Captured Group 1: The relevant content (lowercase, numbers, hyphen, slash, space)
    # \s*               Whitespace
    # \*/               End comment
    
    # We use re.IGNORECASE? No, Tailwind classes are lowercase. 
    # If we see "Approx", we want to keep it. So strict lowercase checking is good.
    
    pattern = r'/\*\s*([a-z0-9\-\/\s]+?)\s*\*/'

    def replacement(match):
        inner = match.group(1)
        # If it contains typical sentence structure or headers, keep it.
        # Our regex [a-z0-9\-\/\s]+ already excludes Capital letters and punctuation like . , : ; ! ?
        # So "Approx 5 rows" will NOT match because of "A".
        # "Prevent body scroll..." will NOT match because of "P" and ",".
        # "--- Header ---" will match "-" but we should check if it's a header. Header usually has spaces or specific format.
        # But wait, "---" is valid in our regex (hyphens). 
        # So we must manually check for "---".
        
        if '---' in inner:
            return match.group(0) # Keep headers
        
        # If it matches, it's likely a tailwind reference like "text-sm" or "bg-slate-900/5"
        # So we remove it.
        return ''

    # Using re.sub with a function
    new_content = re.sub(pattern, replacement, content)
    
    # Clean up empty lines created?
    # Maybe simply removing the comment leaves trailing spaces.
    # We can do a second pass to remove trailing spaces if we want, but usually it's fine.

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)

    print("Successfully cleaned CSS file.")

except Exception as e:
    print(f"Error: {e}")
    sys.exit(1)
