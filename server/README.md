# win32com 修復伺服器

這個伺服器提供 API 端點來修復 win32com 快取問題，特別是解決 `CLSIDToClassMap` 錯誤。

## 使用方法

### 1. 啟動伺服器

```bash
cd server
python repair_server.py
```

伺服器將在 `http://localhost:8765` 啟動。

### 2. 整合到前端應用程式

前端應用程式會自動偵測 win32com 錯誤並顯示修復對話框。當用戶點擊「開始修復」時，會呼叫此 API。

### 3. API 端點

#### POST /api/repair-win32com

請求格式：
```json
{
  "action": "rebuild-cache"
}
```

回應格式：
```json
{
  "success": true,
  "message": "win32com 快取重建成功",
  "details": "已清除損壞的快取並重新生成 COM 物件包裝器"
}
```

## 依賴需求

- Python 3.7+
- pywin32

安裝依賴：
```bash
pip install pywin32
```

## 修復原理

1. **清除快取**: 使用 `win32com.client.gencache.Rebuild()` 清除損壞的快取
2. **重新生成**: 自動重新生成所有 COM 物件的 Python 包裝器
3. **驗證修復**: 測試 Excel COM 物件是否可以正常創建

## 常見問題

### Q: 為什麼需要這個伺服器？
A: 瀏覽器環境無法直接執行 Python 系統指令，需要透過伺服器來執行 win32com 修復。

### Q: 伺服器是否安全？
A: 伺服器只在本地運行，僅提供修復功能，不處理敏感資料。

### Q: 修復失敗怎麼辦？
A: 可以手動執行以下指令：
```bash
python -c "import win32com.client; win32com.client.gencache.Rebuild()"
```

## 開發模式

開發時可以同時啟動前端開發伺服器和修復伺服器：

```bash
# 終端 1: 啟動前端
npm run dev

# 終端 2: 啟動修復伺服器
cd server && python repair_server.py
```

## 故障排除

### 1. 端口衝突
如果 8765 端口被佔用，可以修改 `repair_server.py` 中的端口號碼。

### 2. 權限問題
確保 Python 環境有權限訪問 win32com 模組和系統快取目錄。

### 3. Office 版本問題
確保安裝的 Microsoft Office 支援 COM 自動化。
