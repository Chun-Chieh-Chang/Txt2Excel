# Txt2Excel - TXT轉Excel工具

這是一個高效的Python工具，用於將TXT格式的數據自動轉換並填入Excel報表中。

## 項目結構

```
Txt2Excel/
├── src/                    # 源代碼目錄
│   └── main.py            # 主程序文件
├── dist/                  # 打包後的可執行文件
│   └── Txt2Excel.exe      # 最終可執行文件
├── docs/                  # 文檔目錄
│   ├── README.md          # 項目說明
│   └── CHANGELOG.md       # 更新日誌
├── tests/                 # 測試數據
│   ├── sample.txt         # 示例TXT文件
│   └── sample.xlsx        # 示例Excel文件
├── build/                 # 構建相關文件
│   ├── build.bat          # 打包腳本
│   └── Txt2Excel.spec     # PyInstaller組態檔
└── requirements.txt       # 依賴包列表
```

## 功能特點

- 智能解析TXT文件中的數據
- 圖形化界面操作
- 支持多種編碼格式的TXT文件
- 安全地填入Excel文件，保留原有格式和圖片
- 支持工作表保護和合併單元格處理

## 使用方法

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

## 測試數據

項目包含示例的TXT和Excel文件，位於 `tests/` 目錄中，可用於測試程序功能。