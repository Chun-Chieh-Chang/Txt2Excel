@echo off
chcp 65001 >nul
set TCL_LIBRARY=C:\Python314\tcl\tcl8.6
set TK_LIBRARY=C:\Python314\tcl\tk8.6
set PYTHONPATH=
echo 正在啟動 TXT 轉 Excel 工具...
C:\Python314\python.exe -c "import os; os.environ['TCL_LIBRARY'] = 'C:/Python314/tcl/tcl8.6'; os.environ['TK_LIBRARY'] = 'C:/Python314/tcl/tk8.6'; exec(open('src/main.py', encoding='utf-8').read())"
pause