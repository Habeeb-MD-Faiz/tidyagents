[CmdletBinding()]
param([Parameter(Mandatory=$true)][string]$Plan, [string]$OutputCsv, [string]$FindingsCsv, [string]$DeferredCsv)
$ErrorActionPreference = 'Stop'
$arguments = @((Join-Path $PSScriptRoot 'engine.mjs'), 'doctor', '--plan', $Plan)
if ($OutputCsv) { $arguments += @('--output', $OutputCsv) }
if ($FindingsCsv) { $arguments += @('--findings', $FindingsCsv) }
if ($DeferredCsv) { $arguments += @('--deferred', $DeferredCsv) }
& node @arguments
exit $LASTEXITCODE

