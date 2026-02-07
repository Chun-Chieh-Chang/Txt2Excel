# 深色模式增設與預設化開發紀錄（Txt2Excel）

- 日期：2026-02-02
- 需求摘要：
  - 增設深色模式（Dark Mode）並設為預設
  - 注意字體顏色與背景色對比度
  - 依據 SOP：精準修改、實測驗證、失敗紀錄、檔案整理（MECE）

## 修改範圍（精準修改）
- Tailwind 啟用深色模式（class）：
  - [tailwind.config.js](file:///e:/Self-developed_Apps/QCTools/Txt2Excel/web-app/tailwind.config.js)
- 預設採用深色主題：
  - [index.html](file:///e:/Self-developed_Apps/QCTools/Txt2Excel/web-app/index.html)
- 全域容器與選取樣式：
  - [App.tsx](file:///e:/Self-developed_Apps/QCTools/Txt2Excel/web-app/src/App.tsx#L305-L309)
- 主導覽列與主題切換：
  - [Header.tsx](file:///e:/Self-developed_Apps/QCTools/Txt2Excel/web-app/src/components/Header.tsx)
- 操作面板、資料預覽、檔案上傳、規則畫布、CSV 欄位選擇、步驟指示器、頁尾：
  - [ActionPanel.tsx](file:///e:/Self-developed_Apps/QCTools/Txt2Excel/web-app/src/components/ActionPanel.tsx)
  - [DataPreview.tsx](file:///e:/Self-developed_Apps/QCTools/Txt2Excel/web-app/src/components/DataPreview.tsx)
  - [FileUpload.tsx](file:///e:/Self-developed_Apps/QCTools/Txt2Excel/web-app/src/components/FileUpload.tsx)
  - [RuleCanvas.tsx](file:///e:/Self-developed_Apps/QCTools/Txt2Excel/web-app/src/components/RuleCanvas.tsx)
  - [CsvSelectionModal.tsx](file:///e:/Self-developed_Apps/QCTools/Txt2Excel/web-app/src/components/CsvSelectionModal.tsx)
  - [StepIndicator.tsx](file:///e:/Self-developed_Apps/QCTools/Txt2Excel/web-app/src/components/StepIndicator.tsx)
  - [Footer.tsx](file:///e:/Self-developed_Apps/QCTools/Txt2Excel/web-app/src/components/Footer.tsx)

## 失敗紀錄與矯正措施
- 問題：PowerShell 執行 npm 指令被 Execution Policy 阻擋
  - 現象：`npm run dev` 無法執行（PSSecurityException）
  - 矯正：改以 Node 直接執行工具
    - 開發：`node node_modules/vite/bin/vite.js`
    - 型別檢查：`node node_modules/typescript/bin/tsc --noEmit`
    - 建置：`node node_modules/vite/bin/vite.js build`
- 注意事項（非錯誤）：
  - xlsx-populate 於瀏覽器版本含 eval 警示（minify 與安全風險提醒）
  - 打包後主 bundle 大於 500 kB（屬一般前端警示）；此案屬內部工具，保留現狀

## 實測驗證
- 開發伺服器啟動成功並提供預覽：
  - Local: http://localhost:5173/
  - 以瀏覽器檢視：頁面預設為深色；切換按鈕可正常在深/淺色間切換
  - Console：未見錯誤（以 Vite 啟動端與瀏覽器開發者工具檢查）
- 型別檢查：TypeScript `--noEmit` 通過，無型別錯誤
- 建置：Vite build 成功，僅有一般警示

## 對比度處理與準則
- 深色背景採用 `bg-slate-900/800`，字體採用 `text-slate-100/200`，確保足夠對比
- 次要文字使用 `text-slate-400/500`，避免灰階過低造成可讀性問題
- 強調色維持 `blue-600` 與相容的深色 hover 態；標籤類（例如 `emerald`）於深色下改為透明深綠背景與較亮文字

## 檔案整理（MECE）
- 未新增架構性檔案；僅在現有組件加上 `dark:` 樣式，避免不必要邏輯變更
- 文檔新增於 `docs/` 目錄，與程式碼分離管理

## 推送準備
- 建議提交訊息（中文）：
  - `feat(ui): 增設深色模式並預設啟用，改善對比度`
  - `chore(dev): 補充開發紀錄與實測流程`
- 建議推送流程：
  1. 建立分支：`git checkout -b feature/dark-mode`
  2. 加入變更：`git add .`
  3. 提交：`git commit -m "feat(ui): 增設深色模式並預設啟用，改善對比度"`
  4. 推送：`git push origin feature/dark-mode`

## 回滾方案
- 若需回到淺色預設：移除 `index.html` 的 `class="dark"`；或在 `localStorage.setItem('theme', 'light')` 後重新整理

## 後續決策：移除深色模式（2026-02-03）
- 移除原因：實際觀感不理想，部分區塊對比度與風格不符使用習慣
- 措施（精準修改）：
  - index.html：維持無 `class="dark"`，不再預設深色
  - Header.tsx：停用預設與切換行為
    - 將 `isDark` 初始值改為 `false`
    - 將 `prefersDark` 固定為 `false`，啟動時移除 `.dark`
    - 將主題切換按鈕改為 disabled（不再改動 DOM 的 `.dark`）
  - App.tsx：恢復淺色預設容器樣式
- 實測驗證：
  - 啟動開發伺服器，瀏覽器預覽無 Console 錯誤
  - 介面回歸原本淺色主題，操作流程正常
