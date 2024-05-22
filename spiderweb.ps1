$files = @(
    ".env",
    "pages/api/answer.ts",
    "pages/api/save-query.ts",
    "pages/api/search.ts",
    "utils/index.ts",
    "components/Answer/Answer.tsx",
    "components/SearchResults.tsx"
)

$outputFile = "file_contents.txt"

$separator = "=" * 50

foreach ($file in $files) {
    if (Test-Path $file) {
        Add-Content -Path $outputFile -Value $separator
        Add-Content -Path $outputFile -Value "File: $file"
        Add-Content -Path $outputFile -Value $separator
        Get-Content -Path $file | Add-Content -Path $outputFile
        Add-Content -Path $outputFile -Value ""
    } else {
        Add-Content -Path $outputFile -Value "File not found: $file"
        Add-Content -Path $outputFile -Value ""
    }
}

Write-Host "File contents have been stored in $outputFile"