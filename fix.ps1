$files = @(
    "pages/api/answer.ts",
    "pages/api/save-query.ts",
    "pages/api/search.ts",
    "utils/index.ts"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        $content = Get-Content -Path $file -Raw

        $content = $content -replace '(const handler = async \(req: Request\): Promise<Response> => {)', "`$1`n  console.log('Entering $file handler');"
        $content = $content -replace '(export default async function handler\()', "console.log('Entering $file handler');`n`$1"
        $content = $content -replace '(export const OpenAIStream = async \(prompt: string\): Promise<string> => {)', "`$1`n  console.log('Entering OpenAIStream function');"

        $content = $content -replace '(const { query } = req\.body;)', "`$1`n    console.log('Received query:', query);"
        $content = $content -replace '(const { query, matches } = \(await req\.json\(\)\) as {)', "`$1`n    console.log('Request body:', { query, matches });"
        $content = $content -replace '(const input = query\.replace\(/\\n/g, " "\);)', "`$1`n    console.log('Input:', input);"
        $content = $content -replace '(const res = await fetch\("https://api\.openai\.com/v1/embeddings", {)', "console.log('Fetching embeddings from OpenAI API...');`n    `$1"
        $content = $content -replace '(const json = await res\.json\(\);)', "`$1`n    console.log('Embeddings response:', json);"
        $content = $content -replace '(const { data: chunks, error } = await supabaseAdmin\.rpc\("express_entry_search", {)', "console.log('Searching Express Entry chunks...');`n    `$1"
        $content = $content -replace '(const completion = await openai\.chat\.completions\.create\({)', "console.log('Calling OpenAI API with prompt:', prompt);`n    `$1"
        $content = $content -replace '(const responseText = completion\.choices\[0\]\.message\.content\.trim\(\) \|\| '';)', "`$1`n    console.log('OpenAI API Response:', responseText);"

        Set-Content -Path $file -Value $content
        Write-Host "Added logging statements to $file"
    } else {
        Write-Host "File not found: $file"
    }
}