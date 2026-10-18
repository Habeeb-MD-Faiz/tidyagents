[CmdletBinding()]
param([Parameter(Mandatory=$true)][string]$Plan, [string]$RunDir, [string]$ReviewedPlanSha256, [switch]$Execute)
# Dry run is the default and creates no files, directories, locks, or logs.
$ErrorActionPreference = 'Stop'
$arguments = @((Join-Path $PSScriptRoot 'engine.mjs'), 'apply', '--plan', $Plan)
if ($RunDir) { $arguments += @('--run', $RunDir) }
if ($ReviewedPlanSha256) { $arguments += @('--reviewed-plan-sha256', $ReviewedPlanSha256) }
if ($Execute) { $arguments += '--execute' }
& node @arguments
exit $LASTEXITCODE

