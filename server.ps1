# Simple PowerShell HTTP Server
# Run with: powershell -ExecutionPolicy Bypass -File server.ps1

$port = 8000
$root = Get-Location
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()

Write-Host "Starting server at http://localhost:$port/"
Write-Host "Root Directory: $root"
Write-Host "Press Ctrl+C to stop."

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
        
        $localPath = $root.Path + $request.Url.LocalPath.Replace('/', '\')
        
        # Default to index.html if directory
        if ((Test-Path $localPath -PathType Container) -and (Test-Path (Join-Path $localPath "index.html"))) {
             $localPath = Join-Path $localPath "index.html"
        }

        if (Test-Path $localPath -PathType Leaf) {
            try {
                $content = [System.IO.File]::ReadAllBytes($localPath)
                $extension = [System.IO.Path]::GetExtension($localPath)
                
                # Basic MIME types
                switch ($extension) {
                    ".html" { $response.ContentType = "text/html" }
                    ".css"  { $response.ContentType = "text/css" }
                    ".js"   { $response.ContentType = "application/javascript" }
                    ".json" { $response.ContentType = "application/json" }
                    ".png"  { $response.ContentType = "image/png" }
                    ".jpg"  { $response.ContentType = "image/jpeg" }
                    ".svg"  { $response.ContentType = "image/svg+xml" }
                    Default { $response.ContentType = "application/octet-stream" }
                }

                $response.ContentLength64 = $content.Length
                $response.OutputStream.Write($content, 0, $content.Length)
                $response.StatusCode = 200
            }
            catch {
                $response.StatusCode = 500
            }
        }
        else {
            $response.StatusCode = 404
        }
        
        $response.Close()
    }
}
finally {
    $listener.Stop()
}
