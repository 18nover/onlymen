@echo off
setlocal
set "ONLYMEN_PS=\\wsl.localhost\Ubuntu-26.04\home\jerry\onlymen\scripts\dev\onlymen.ps1"
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%ONLYMEN_PS%" %*
exit /b %ERRORLEVEL%
