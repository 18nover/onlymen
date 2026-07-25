[CmdletBinding()]
param(
  [Parameter(Position = 0)]
  [ValidateSet(
    'bootstrap',
    'doctor',
    'start',
    'status',
    'logs',
    'attach',
    'stop',
    'restart',
    'verify',
    'help'
  )]
  [string] $Command = 'status',

  [Parameter(Position = 1, ValueFromRemainingArguments)]
  [string[]] $CommandArguments
)

$ErrorActionPreference = 'Stop'
$Distro = 'Ubuntu-26.04'
$LinuxUser = 'jerry'
$LinuxCommand = '/home/jerry/onlymen/scripts/dev/onlymen'

function Start-DockerDesktopIfNeeded {
  $docker = Get-Command docker -ErrorAction SilentlyContinue
  if (-not $docker) {
    throw 'Docker Desktop is not installed or docker.exe is not on the Windows PATH.'
  }

  & $docker.Source info *> $null
  if ($LASTEXITCODE -eq 0) {
    return
  }

  Write-Host '[onlymen] Starting Docker Desktop...'
  & $docker.Source desktop start
  if ($LASTEXITCODE -ne 0) {
    throw 'Docker Desktop did not start successfully.'
  }

  for ($attempt = 1; $attempt -le 60; $attempt++) {
    & $docker.Source info *> $null
    if ($LASTEXITCODE -eq 0) {
      return
    }
    Start-Sleep -Seconds 2
  }

  throw 'Timed out waiting for Docker Desktop.'
}

if ($Command -in @('start', 'restart', 'verify')) {
  Start-DockerDesktopIfNeeded
}

$wslArguments = @(
  '--distribution',
  $Distro,
  '--user',
  $LinuxUser,
  '--',
  $LinuxCommand,
  $Command
) + $CommandArguments

& wsl.exe @wslArguments
exit $LASTEXITCODE
