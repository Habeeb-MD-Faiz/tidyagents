[CmdletBinding()]
param([string]$WorkDir)
$ErrorActionPreference = 'Stop'
$repoRoot = Split-Path -Parent $PSScriptRoot
if (-not $WorkDir) {
    $stamp = Get-Date -Format 'yyyyMMdd-HHmmss-fff'
    $WorkDir = Join-Path $repoRoot ('runs\smoke-' + $stamp)
}
try {
    $scripts = @(Get-ChildItem -LiteralPath (Join-Path $repoRoot 'skills\tidyagents\scripts') -Filter '*.ps1' -File)
    $scripts += Get-Item -LiteralPath $PSCommandPath
    foreach ($script in $scripts) {
        $parseTokens = $null
        $parseErrors = $null
        [void][Management.Automation.Language.Parser]::ParseFile($script.FullName, [ref]$parseTokens, [ref]$parseErrors)
        if ($parseErrors.Count -gt 0) { throw ('PowerShell parse failure: ' + $script.Name) }
    }
    & node (Join-Path $PSScriptRoot 'fixtures.mjs') $WorkDir
    if ($LASTEXITCODE -ne 0) { throw 'Fixture process failed' }
    'POWERSHELL 5.1 PARSE: PASS'
    'SMOKE PASS'
    exit 0
} catch {
    Write-Output ('SMOKE FAIL: ' + $_.Exception.Message)
    exit 1
}

