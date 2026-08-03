@echo off
setlocal
set "ONLYMEN_WSL=/home/jerry/onlymen/bin/om"

if /I "%~1"=="install-shell" goto install_shell

wsl.exe --distribution Ubuntu-26.04 --user jerry -- "%ONLYMEN_WSL%" %*
set "ONLYMEN_EXIT=%ERRORLEVEL%"
if "%ONLYMEN_EXIT%"=="0" if /I "%~1"=="bootstrap" call :install_shell
exit /b %ONLYMEN_EXIT%

:install_shell
set "ONLYMEN_BIN=%LOCALAPPDATA%\OnlyMen\bin"
if not exist "%ONLYMEN_BIN%" mkdir "%ONLYMEN_BIN%"
copy /Y "%~f0" "%ONLYMEN_BIN%\om.cmd" >nul
powershell.exe -NoProfile -Command "$bin='%ONLYMEN_BIN%'; $path=[Environment]::GetEnvironmentVariable('Path','User'); $entries=@($path -split ';' | Where-Object { $_ }); if ($entries -notcontains $bin) { [Environment]::SetEnvironmentVariable('Path',((@($entries) + $bin) -join ';'),'User') }"
echo [onlymen] Installed %ONLYMEN_BIN%\om.cmd
echo [onlymen] Open a new terminal, then use: om status
exit /b 0
