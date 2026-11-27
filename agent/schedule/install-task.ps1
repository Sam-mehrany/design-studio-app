# Registers the agent as a daily Windows scheduled task for the current user.
#   powershell -ExecutionPolicy Bypass -File schedule\install-task.ps1            # daily at 20:43
#   powershell -ExecutionPolicy Bypass -File schedule\install-task.ps1 -Time 21:15
# Remove it again:  Unregister-ScheduledTask -TaskName "Design Studio Pinterest Agent" -Confirm:$false
param(
  [string]$Time = "20:43",
  [string]$TaskName = "Design Studio Pinterest Agent"
)
$ErrorActionPreference = "Stop"
$here = Split-Path -Parent $MyInvocation.MyCommand.Path
$cmd = Join-Path $here "run-agent.cmd"
if (-not (Get-Command node -ErrorAction SilentlyContinue)) { throw "node is not on PATH - install Node.js 20+ first" }

$action   = New-ScheduledTaskAction -Execute "cmd.exe" -Argument "/c `"$cmd`""
$trigger  = New-ScheduledTaskTrigger -Daily -At $Time
# StartWhenAvailable: if the PC was off at $Time, run as soon as it is back on.
$settings = New-ScheduledTaskSettingsSet -StartWhenAvailable -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries `
            -ExecutionTimeLimit (New-TimeSpan -Hours 2) -MultipleInstances IgnoreNew

Register-ScheduledTask -TaskName $TaskName -Action $action -Trigger $trigger -Settings $settings `
  -Description "Ingests new Pinterest pins into the Design Studio vault (agent in $((Resolve-Path "$here\..").Path))" -Force | Out-Null

Write-Host "Registered '$TaskName': daily at $Time (runs late if the PC was off)."
Write-Host "Run it now:   Start-ScheduledTask -TaskName '$TaskName'"
Write-Host "Its log:      $((Resolve-Path "$here\..").Path)\runs\scheduled.log"
