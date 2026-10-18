[CmdletBinding()]
param([Parameter(Mandatory=$true)][string]$Plan, [string]$RunDir, [string]$ReviewedPlanSha256, [switch]$Execute)
# Restore adapters from a reviewed plan. Does not install software or restore sign-in.
$arguments = @('-NoProfile', '-File', (Join-Path $PSScriptRoot 'apply.ps1'), '-Plan', $Plan)
if ($RunDir) { $arguments += @('-RunDir', $RunDir) }
if ($ReviewedPlanSha256) { $arguments += @('-ReviewedPlanSha256', $ReviewedPlanSha256) }
if ($Execute) { $arguments += '-Execute' }
& powershell.exe @arguments
exit $LASTEXITCODE

