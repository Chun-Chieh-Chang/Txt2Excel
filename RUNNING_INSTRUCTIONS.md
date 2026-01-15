# 如何運行 Txt2Excel v2.1_20251213

## 環境要求
- Windows 作業系統
- Python 3.14 (已包含在專案中)

## 運行方法

### 方法一：使用批次檔（推薦）
按兩下執行 `run_app.bat` 檔案，這將自動設定所需的環境變數並啟動應用程式。

### 方法二：命令列執行
如果需要透過命令列執行，請執行以下步驟：

1. 開啟命令提示字元 (CMD)
2. 切換到專案目錄：
   ```
   cd c:\Users\3kids\Downloads\Self-developed_Apps\OfficeTools\Txt2Excel
   ```
3. 设置环境变量并运行程序：
   ```
   set TCL_LIBRARY=C:\Python314\tcl\tcl8.6
   set TK_LIBRARY=C:\Python314\tcl\tk8.6
   C:\Python314\python.exe src/main.py
   ```

## 常見問題

### 1. 出現 "Can't find a usable init.tcl" 錯誤
這是因為 Tcl/Tk 函式庫路徑未正確設定所造成。請使用上述推薦的方式執行程式。

### 2. 介面顯示亂碼
這是因為主控台編碼設定不正確。批次檔中已包含 `chcp 65001` 命令來設定 UTF-8 編碼。

## 技術細節

本工具使用下列技術：
- Python 3.14
- Tkinter (GUI框架)
- openpyxl (Excel檔案處理)
- pywin32 (Windows COM介面)

合併儲存格處理已特別最佳化，確保每個合併區域只儲存一個資料值。

## 故障排除

如果仍舊遇到 Tcl/Tk 相關錯誤：

1. 確認 `C:\Python314\tcl\tcl8.6` 和 `C:\Python314\tcl\tk8.6` 目錄存在且包含相關檔案
2. 嘗試以管理員身分執行命令提示字元
3. 檢查 Windows Defender 或其他防毒軟體是否阻止了對 Tcl/Tk 檔案的存取
4. 確保沒有其他 Python 環境干擾（如 Anaconda 等）

若以上方法皆無法解決問題，請聯絡技術支援。