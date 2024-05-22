# Define the path to the search.ts file
$searchTsPath = "C:\projects\expressentry\pages\api\search.ts"

# Read the content of the file
$content = Get-Content $searchTsPath -Raw

# Define the problematic string pattern
$problemPattern = 'const { query, matches } = \(await req.json\(\)\) as \{
console.log\(''Request body:'', \{ query, matches \}\);
  query: string;
  matches: number;
\};'

# Define the corrected string
$correctedString = 'const body = (await req.json()) as {
  query: string;
  matches: number;
};

const { query, matches } = body;
console.log(''Request body:'', { query, matches });'

# Replace the problematic pattern with the corrected string
$correctedContent = $content -replace [regex]::Escape($problemPattern), $correctedString

# Write the corrected content back to the file
Set-Content -Path $searchTsPath -Value $correctedContent

Write-Host "The search.ts file has been updated."