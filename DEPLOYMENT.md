# GitHub Pages 部署指南

## 📋 部署狀態

✅ **已完成初始部署**

- 倉庫地址：https://github.com/Chun-Chieh-Chang/Txt2Excel
- GitHub Pages 網址：https://chun-chieh-chang.github.io/Txt2Excel/

## 🚀 自動部署流程

本專案已配置 GitHub Actions 自動部署流程，每次推送到 `main` 分支時會自動部署到 GitHub Pages。

### 工作流程文件位置
`.github/workflows/deploy.yml`

### 部署內容
- 源目錄：`docs/`
- 包含文件：
  - `index.html` - 主頁
  - `styles.css` - 樣式表
  - `script.js` - 互動腳本
  - `*.md` - Markdown 文檔

## ⚙️ GitHub Pages 設置步驟

### 1. 啟用 GitHub Pages

1. 前往倉庫設置：https://github.com/Chun-Chieh-Chang/Txt2Excel/settings/pages
2. 在 "Source" 部分選擇：
   - Source: **GitHub Actions**
3. 點擊 "Save"

### 2. 驗證部署

1. 前往 Actions 頁面：https://github.com/Chun-Chieh-Chang/Txt2Excel/actions
2. 查看最新的 "Deploy GitHub Pages" 工作流程
3. 確認狀態為綠色勾選 ✅
4. 訪問網站：https://chun-chieh-chang.github.io/Txt2Excel/

## 📝 更新網站內容

### 方式一：直接編輯（推薦）

1. 編輯 `docs/` 目錄下的文件
2. 提交更改：
   ```bash
   git add docs/
   git commit -m "Update documentation"
   git push origin main
   ```
3. GitHub Actions 會自動部署更新

### 方式二：本地測試後部署

1. 在本地編輯文件
2. 使用瀏覽器打開 `docs/index.html` 預覽
3. 確認無誤後推送：
   ```bash
   git add .
   git commit -m "Update website content"
   git push origin main
   ```

## 🎨 自定義域名（可選）

如果您有自己的域名，可以配置自定義域名：

1. 在 `docs/` 目錄創建 `CNAME` 文件
2. 文件內容為您的域名，例如：`txt2excel.example.com`
3. 在域名提供商處配置 DNS：
   - 類型：CNAME
   - 名稱：txt2excel（或您的子域名）
   - 值：chun-chieh-chang.github.io
4. 推送更改到 GitHub
5. 在倉庫設置中驗證域名

## 🔧 故障排除

### 部署失敗

1. 檢查 Actions 日誌：https://github.com/Chun-Chieh-Chang/Txt2Excel/actions
2. 確認 `docs/` 目錄包含 `index.html`
3. 檢查文件權限和路徑

### 網站無法訪問

1. 確認 GitHub Pages 已啟用
2. 等待 1-2 分鐘讓部署完成
3. 清除瀏覽器緩存
4. 檢查倉庫是否為公開（Public）

### 樣式未加載

1. 確認 CSS/JS 文件路徑正確
2. 檢查文件是否已提交到倉庫
3. 查看瀏覽器控制台錯誤信息

## 📚 相關資源

- [GitHub Pages 官方文檔](https://docs.github.com/pages)
- [GitHub Actions 文檔](https://docs.github.com/actions)
- [自定義域名指南](https://docs.github.com/pages/configuring-a-custom-domain-for-your-github-pages-site)

## 🎯 下一步

1. ✅ 完成初始部署
2. ⏳ 在 GitHub 設置中啟用 Pages（需要手動操作）
3. ⏳ 驗證網站訪問
4. ⏳ 根據需要更新內容

---

**最後更新：** 2025-01-15  
**維護者：** Wesley Chang (wesleychang2025@gmail.com)
