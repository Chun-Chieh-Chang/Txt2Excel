# Txt2Excel v2.1_20251213 - TXT轉Excel工具

這是一個高效的Python工具，用於將TXT格式的數據自動轉換並填入Excel報表中。

## 項目結構

```
Txt2Excel/
├── src/                    # 源代碼目錄
│   └── main.py            # 主程序文件
├── dist/                  # 打包後的可執行文件
│   └── Txt2Excel v2.1_20251213.exe      # 最終可執行文件
├── docs/                  # 文檔目錄
│   ├── user_manual.md     # 用戶手冊
│   ├── technical_documentation.md  # 技術文檔
│   ├── README.md          # 項目說明
│   └── CHANGELOG.md       # 更新日誌
├── TestData/              # 測試數據
│   ├── sample.txt         # 示例TXT文件
│   └── sample.xlsx        # 示例Excel文件
├── build/                 # 構建相關文件
│   ├── build.bat          # 打包腳本
│   └── Txt2Excel.spec     # PyInstaller組態檔
├── requirements.txt       # 依賴包列表
├── run_app.bat            # 運行腳本
└── RUNNING_INSTRUCTIONS.md # 運行說明
```

## 功能特點

- 智能解析TXT文件中的數據
- 圖形化界面操作
- 支持多種編碼格式的TXT文件
- 安全地填入Excel文件，保留原有格式和圖片
- 支持工作表保護和合併單元格處理
- 雙引擎支持 (openpyxl + win32com)
- 記憶體優化與垃圾回收
- 多線程安全設計
- 完善錯誤處理機制

## 使用方法

### 方法一：使用可執行文件（推薦給最終用戶）
直接運行 `dist/Txt2Excel v2.1_20251213.exe` 文件

### 方法二：使用批處理文件
雙擊運行 `run_app.bat` 文件，這將自動設置所需的環境變量並啟動應用

### 方法三：命令行運行（開發人員）
1. 安裝依賴：
   ```
   pip install -r requirements.txt
   ```

2. 運行程序：
   ```
   python src/main.py 或
   py src/main.py
   ```

3. 或者打包成可執行文件：
   ```
   cd build
   build.bat
   ```

## 文檔資料

- [用戶手冊](user_manual.md) - 詳細的使用說明和操作指南
- [技術文檔](technical_documentation.md) - 技術架構和實現細節
- [更新日誌](CHANGELOG.md) - 版本更新歷史和功能變更
- [運行說明](../RUNNING_INSTRUCTIONS.md) - 環境配置和故障排除指南

## 測試數據

項目包含示例的TXT和Excel文件，位於 `TestData/` 目錄中，可用於測試程序功能。

## 技術支持

開發者：Wesley Chang
郵箱：wesleychang2025@gmail.com