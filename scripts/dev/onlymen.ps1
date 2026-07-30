[CmdletBinding()]
param(
  [Parameter(Position = 0)]
  [ValidateSet(
    'bootstrap',
    'doctor',
    'auth',
    'start',
    'status',
    'logs',
    'attach',
    'stop',
    'restart',
    'verify',
    'open',
    'shell',
    'install-shell',
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
$WindowsLauncherSource = '\\wsl.localhost\Ubuntu-26.04\home\jerry\onlymen\scripts\dev\om.cmd'

function Install-OnlyMenLauncher {
  $binDirectory = Join-Path $env:LOCALAPPDATA 'OnlyMen\bin'
  $launcher = Join-Path $binDirectory 'om.cmd'
  New-Item -ItemType Directory -Path $binDirectory -Force | Out-Null
  Copy-Item -LiteralPath $WindowsLauncherSource -Destination $launcher -Force

  $userPath = [Environment]::GetEnvironmentVariable('Path', 'User')
  $pathEntries = @($userPath -split ';' | Where-Object { $_ })
  if ($pathEntries -notcontains $binDirectory) {
    $updatedPath = (@($pathEntries) + $binDirectory) -join ';'
    [Environment]::SetEnvironmentVariable('Path', $updatedPath, 'User')
  }

  Write-Host "[onlymen] Installed $launcher"
  Write-Host '[onlymen] Open a new terminal, then use: om status'
}

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

if ($Command -eq 'install-shell') {
  Install-OnlyMenLauncher
  exit 0
}

if ($Command -eq 'open') {
  $target = if ($CommandArguments.Count -gt 0) { $CommandArguments[0] } else { 'code' }
  switch ($target) {
    'code' {
      & code --remote wsl+Ubuntu-26.04 /home/jerry/onlymen
      exit $LASTEXITCODE
    }
    'app' {
      Start-Process 'http://localhost:8082'
      exit 0
    }
    { $_ -in @('agents', 'console') } {
      Start-Process 'http://localhost:4173'
      exit 0
    }
    default {
      throw "Unknown open target '$target'. Use code, app, or agents."
    }
  }
}

if ($Command -eq 'shell') {
  & wsl.exe --distribution $Distro --user $LinuxUser --cd /home/jerry/onlymen
  exit $LASTEXITCODE
}

if ($Command -in @('start', 'restart') -or
  ($Command -eq 'verify' -and
    ($CommandArguments.Count -eq 0 -or $CommandArguments[0] -eq 'all'))) {
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
$exitCode = $LASTEXITCODE
if ($exitCode -eq 0 -and $Command -eq 'bootstrap') {
  Install-OnlyMenLauncher
}
exit $exitCode
