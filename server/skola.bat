@echo off
cd src
:retry
R:\soukrome\nodejs\node index
pause
goto retry
