
$path = "c:\project\vssi\css\style.css"
$content = Get-Content $path -Raw -Encoding UTF8

# Regex to remove Tailwind-style comments
# Matches /* ... */ containing only lowercase letters, numbers, hyphens, slashes, and spaces.
# Uses negative lookahead (?!...) to ensure it doesn't start with "---" or "===".
# Also ensuring it doesn't contain capital letters by using [a-z0-9...].
# This preserves "Approx 5 rows" (Capital A) and headers.

$pattern = '/\*\s*(?!---|===)[a-z0-9\s\-\/]+\s*\*/'

# Replace with empty string
$cleanContent = [Regex]::Replace($content, $pattern, '')

# Write back
Set-Content $path $cleanContent -Encoding UTF8

Write-Host "Cleaned CSS file."
