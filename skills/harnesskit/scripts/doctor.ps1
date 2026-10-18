[CmdletBinding()]
param([Parameter(Mandatory=$true)][string]$Plan, [string]$OutputCsv)
$ErrorActionPreference = 'Stop'
$arguments = @((Join-Path $PSScriptRoot 'engine.mjs'), 'doctor', '--plan', $Plan)
if ($OutputCsv) { $arguments += @('--output', $OutputCsv) }
& node @arguments
exit $LASTEXITCODE

