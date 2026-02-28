@echo off
setlocal
if "%HOST%"=="" set HOST=0.0.0.0
if "%PORT%"=="" set PORT=8000

echo 启动中: http://%HOST%:%PORT%
python serve.py
endlocal
