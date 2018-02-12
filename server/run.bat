@echo off
cd src
:retry
node index
pause
goto retry
