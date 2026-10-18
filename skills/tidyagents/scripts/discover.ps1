[CmdletBinding()]
param([string]$HomeRoot, [string]$RepoRoot, [string]$RootsCsv, [string]$ApprovedFilesCsv, [string]$OutputCsv)
$ErrorActionPreference = 'Stop'
$engine = Join-Path $PSScriptRoot 'engine.mjs'
$arguments = @($engine, 'discover')
if ($HomeRoot) { $arguments += @('--home', $HomeRoot) }
if ($RepoRoot) { $arguments += @('--repo', $RepoRoot) }
if ($RootsCsv) { $arguments += @('--roots', $RootsCsv) }
if ($ApprovedFilesCsv) { $arguments += @('--approved-files', $ApprovedFilesCsv) }
if ($OutputCsv) { $arguments += @('--output', $OutputCsv) }
& node @arguments
exit $LASTEXITCODE

