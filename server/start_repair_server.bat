@echo off
echo 🔧 啟動 win32com 修復伺服器...
echo.

REM 檢查 Python 是否可用
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ 錯誤: 找不到 Python
    echo 請確保 Python 已安裝並加入 PATH 環境變數
    pause
    exit /b 1
)

REM 檢查 pywin32 是否安裝
python -c "import win32com.client" >nul 2>&1
if errorlevel 1 (
    echo ❌ 錯誤: 找不到 win32com 模組
    echo 正在安裝 pywin32...
    pip install pywin32
    if errorlevel 1 (
        echo ❌ 安裝失敗，請手動執行: pip install pywin32
        pause
        exit /b 1
    )
)

REM 啟動伺服器
echo ✅ 環境檢查通過，啟動伺服器...
echo.
python repair_server.py

pause
