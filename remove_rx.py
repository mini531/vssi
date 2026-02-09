import re
import sys

# Read the file
with open('c:/project/vssi/screens/SAM_MO_01_01.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Remove all rx attributes
content = re.sub(r'\s+rx="[^"]*"', '', content)

# Write back
with open('c:/project/vssi/screens/SAM_MO_01_01.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Removed all rx attributes")
