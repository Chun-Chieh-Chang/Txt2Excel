# win32com 一鍵修復功能使用指南

## 功能概述

TXT to Excel 工具現已內建 **win32com 一鍵修復功能**，當遇到 `CLSIDToClassMap` 等相關錯誤時，會自動偵測並提供修復選項。

## 🚀 快速開始

### 1. 啟動修復伺服器

#### 方法 A: 使用 npm 腳本 (推薦)
```bash
npm run start-repair-server
```

#### 方法 B: 手動啟動
```bash
cd server
python repair_server.py
```

#### 方法 C: 使用批次檔 (Windows)
```bash
cd server
start_repair_server.bat
```

### 2. 啟動主應用程式
```bash
npm run dev
```

### 3. 使用修復功能
1. 當應用程式遇到 win32com 錯誤時，會自動顯示修復對話框
2. 點擊「開始修復」按鈕
3. 等待修復完成
4. 修復成功後應用程式會自動重試失敗的操作

## 🔧 修復流程

### 自動偵測
系統會自動偵測以下錯誤模式：
- `CLSIDToClassMap` 屬性缺失
- `win32com.gen_py` 模組錯誤
- Excel COM 物件創建失敗

### 修復步驟
1. **清除快取**: 刪除損壞的 COM 快取檔案
2. **重建快取**: 重新生成所有 COM 物件包裝器
3. **驗證修復**: 測試 Excel COM 物件是否正常運作

### 自動重試
修復成功後，系統會自動重試之前失敗的操作，無需手動重新上傳檔案。

## 📋 系統需求

### 必要依賴
- **Python 3.7+**
- **pywin32** (自動安裝)
- **Microsoft Office** (支援 COM 自動化)

### 安裝依賴
```bash
pip install pywin32
```

## 🛠️ 故障排除

### 修復失敗處理

#### 1. 手動修復指令
```bash
python -c "import win32com.client; win32com.client.gencache.Rebuild()"
```

#### 2. 檢查 Office 安裝
確保 Microsoft Office 完整安裝且支援 COM 自動化：
```bash
python -c "import win32com.client; excel = win32com.client.Dispatch('Excel.Application'); print('Excel COM OK')"
```

#### 3. 權限問題
以管理員權限執行命令提示字元，然後啟動修復伺服器。

### 常見錯誤訊息

#### ❌ "找不到 win32com 模組"
**解決方案**: 安裝 pywin32
```bash
pip install pywin32
```

#### ❌ "端口 8765 被佔用"
**解決方案**: 修改 `server/repair_server.py` 中的端口號碼，或關閉佔用端口的程式。

#### ❌ "Excel COM 物件創建失敗"
**解決方案**: 
1. 檢查 Microsoft Office 是否正確安裝
2. 重啟電腦後重試
3. 以管理員權限執行修復

## 🎯 最佳實踐

### 預防措施
1. **定期修復**: 每次 Office 更新後執行一次修復
2. **環境穩定**: 避免頻繁更改 Python 環境
3. **備份設定**: 定期備份設定檔和範本

### 開發環境
```bash
# 終端 1: 啟動前端開發伺服器
npm run dev

# 終端 2: 啟動修復伺服器
npm run start-repair-server
```

### 生產環境
- 建議將修復伺服器包裝為 Windows 服務
- 設定自動重啟機制
- 監控伺服器狀態

## 📞 技術支援

如遇到無法解決的問題：
1. 檢查本指南的故障排除章節
2. 查看應用程式控制台錯誤訊息
3. 確認系統環境符合需求
4. 重新安裝 pywin32 和 Microsoft Office

---

**注意**: 此修復功能僅適用於 Windows 系統，且需要安裝 Microsoft Office。
