# Txt2Excel v3.0

一個現代化的 Web 工具，用於將 TXT/CSV 資料自動填入 Excel 模板。支援多產品設定檔管理、跨工作表填寫、自動編碼偵測等進階功能。

## ✨ 主要功能

### 📄 資料處理
- **TXT 檔案支援**：純文字檔，每行代表一筆數據
- **CSV 檔案支援**：多欄位數據，可選擇特定欄位匯入
- **自動編碼偵測**：支援 UTF-8、Big5、GBK 等編碼，避免亂碼

### 📊 Excel 填寫
- **智慧填寫**：根據自訂規則將資料填入 Excel 模板
- **格式保留**：完整保留原始 Excel 的格式、樣式、圖片
- **跨工作表支援**：可在多個工作表中填寫資料
- **自動分頁**：資料超過單頁容量時自動分配到多個工作表

### 💾 設定檔管理（多產品支援）
- **儲存設定**：
  - 新建檔案：建立全新的設定檔庫
  - 加入現有：追加到已存在的設定檔庫
- **載入設定**：支援單一設定檔或設定檔庫
- **設定檔編輯**：
  - ✏️ 重命名：直接修改設定檔名稱
  - 🗑️ 刪除：移除不需要的設定檔
- **相對位置計算**：設定檔可自動適應不同的工作表結構

## 🚀 快速開始

### 線上使用
訪問 [GitHub Pages 部署版本](https://your-username.github.io/Txt2Excel_v3.0/)

### 本地開發

1. **安裝依賴**
```bash
npm install
```

2. **啟動開發伺服器**
```bash
npm run dev
```

3. **建置生產版本**
```bash
npm run build
```

## 📖 使用說明

### 基本流程
1. **上傳資料來源**：選擇 TXT 或 CSV 檔案
2. **上傳 Excel 模板**：選擇您的報告模板
3. **設定填寫規則**：定義資料如何填入 Excel
4. **執行填入**：點擊執行，自動下載結果

### 設定檔管理
- **儲存**：將常用設定儲存為設定檔，方便日後快速套用
- **載入**：從設定檔庫中選擇產品設定
- **管理**：重命名或刪除設定檔（修改會立即寫入檔案）

詳細說明請參閱應用程式內的「使用說明」。

## 🛠️ 技術架構

### 前端框架
- **React 18** + **TypeScript**
- **Vite** - 快速的建置工具
- **TailwindCSS** - 現代化的 UI 設計

### 核心函式庫
- **xlsx-populate** - Excel 檔案處理
- **jschardet** - 自動編碼偵測
- **lucide-react** - 圖示系統

### 瀏覽器 API
- **File System Access API** - 檔案讀寫（需 Chrome/Edge）
- **Web Workers** - 背景處理（未來規劃）

## 📁 專案結構

```
Txt2Excel_v3.0/
├── src/
│   ├── components/          # React 元件
│   │   ├── ActionPanel.tsx
│   │   ├── CsvSelectionModal.tsx
│   │   ├── DataPreview.tsx
│   │   ├── FileUpload.tsx
│   │   ├── Footer.tsx
│   │   ├── Header.tsx
│   │   ├── HelpModal.tsx
│   │   ├── ProductSelectionModal.tsx
│   │   ├── ProfileManager.tsx
│   │   ├── RuleCanvas.tsx
│   │   ├── RuleModal.tsx
│   │   ├── SheetSelectionModal.tsx
│   │   └── StepIndicator.tsx
│   ├── types/               # TypeScript 型別定義
│   │   └── index.ts
│   ├── App.tsx              # 主應用程式
│   ├── logic.ts             # 核心邏輯
│   ├── index.css            # 全域樣式
│   └── main.tsx             # 應用程式入口
├── test-data/               # 測試資料（不會部署）
├── DEVELOPMENT_LOG.md       # 開發日誌
├── README.md                # 專案說明
└── package.json             # 專案配置
```

## 🔧 開發規範

### 程式碼風格
- 使用 TypeScript 嚴格模式
- 遵循 React Hooks 規則
- 元件採用函數式寫法

### 提交規範
- 精準修改：僅針對必要部分進行修訂
- 運行測試：確保功能正確且無 Console 錯誤
- 開發紀錄：記錄失敗嘗試與解決方案

## 📝 開發日誌

詳細的開發過程、問題分析、解決方案請參閱 [DEVELOPMENT_LOG.md](./DEVELOPMENT_LOG.md)

## 🐛 已知限制

- **瀏覽器支援**：File System Access API 需要 Chrome 86+ 或 Edge 86+
- **檔案大小**：建議單個 Excel 檔案不超過 50MB
- **並發處理**：目前為單執行緒處理，大量資料可能需要等待

## 📄 授權

MIT License

## 👨‍💻 作者

Wesley Chang @ Mouldex

---

**注意**：本專案使用 File System Access API，需要在支援的瀏覽器（Chrome/Edge）中使用。
