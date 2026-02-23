// win32com 錯誤偵測與修復工具

export interface Win32ComError {
  isWin32ComError: boolean;
  errorMessage: string;
  canAutoRepair: boolean;
}

/**
 * 偵測錯誤是否為 win32com 相關錯誤
 */
export function detectWin32ComError(error: any): Win32ComError {
  const errorMessage = error?.message || error?.toString() || "";
  
  // 檢查常見的 win32com 錯誤模式
  const win32comPatterns = [
    /CLSIDToClassMap/,
    /win32com\.gen_py/,
    /module .* has no attribute/,
    /COM.*error/,
    /Dispatch.*failed/,
    /gen_py.*00020813/,  // Excel GUID
  ];

  const isWin32ComError = win32comPatterns.some(pattern => pattern.test(errorMessage));
  
  return {
    isWin32ComError,
    errorMessage,
    canAutoRepair: isWin32ComError && errorMessage.includes('CLSIDToClassMap')
  };
}

/**
 * 執行 win32com 快取修復
 */
export async function repairWin32ComCache(): Promise<{ success: boolean; error?: string }> {
  try {
    // 這裡需要後端 API 支援，因為瀏覽器環境無法直接執行 Python
    const response = await fetch("/api/repair-win32com", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ action: "rebuild-cache" }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    return result;
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "修復過程中發生未知錯誤"
    };
  }
}

/**
 * 為開發環境提供本地修復函數（僅在 Node.js 環境有效）
 */
export function getLocalRepairCommand(): string {
  return `python -c "import win32com.client; win32com.client.gencache.Rebuild()"`;
}

/**
 * 檢查是否為可修復的 win32com 錯誤
 */
export function isRepairableWin32ComError(error: any): boolean {
  const detection = detectWin32ComError(error);
  return detection.isWin32ComError && detection.canAutoRepair;
}
