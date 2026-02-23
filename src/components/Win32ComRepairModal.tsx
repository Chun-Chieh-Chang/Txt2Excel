import { useState } from "react";
import { AlertTriangle, Wrench, CheckCircle, Loader2 } from "lucide-react";

interface Win32ComRepairModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRepairComplete: () => void;
}

export default function Win32ComRepairModal({ isOpen, onClose, onRepairComplete }: Win32ComRepairModalProps) {
  const [isRepairing, setIsRepairing] = useState(false);
  const [repairStatus, setRepairStatus] = useState<"idle" | "repairing" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleRepair = async () => {
    setIsRepairing(true);
    setRepairStatus("repairing");
    setErrorMessage("");

    try {
      // 模擬呼叫後端 API 來執行 win32com 修復
      const response = await fetch("/api/repair-win32com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: "rebuild-cache" }),
      });

      if (!response.ok) {
        throw new Error(`修復失敗: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (result.success) {
        setRepairStatus("success");
        setTimeout(() => {
          onRepairComplete();
          onClose();
        }, 2000);
      } else {
        throw new Error(result.error || "修復過程中發生未知錯誤");
      }
    } catch (error: any) {
      setRepairStatus("error");
      setErrorMessage(error.message);
    } finally {
      setIsRepairing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${
              repairStatus === "success" ? "bg-emerald-100 dark:bg-emerald-900" :
              repairStatus === "error" ? "bg-red-100 dark:bg-red-900" :
              "bg-amber-100 dark:bg-amber-900"
            }`}>
              {repairStatus === "success" ? (
                <CheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              ) : repairStatus === "error" ? (
                <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
              ) : (
                <Wrench className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                {repairStatus === "success" ? "修復完成" :
                 repairStatus === "error" ? "修復失敗" :
                 "修復 win32com 錯誤"}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                {repairStatus === "success" ? "win32com 快取已重建完成" :
                 repairStatus === "error" ? "請檢查錯誤訊息並重試" :
                 "重建 COM 快取以解決 CLSIDToClassMap 錯誤"}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {repairStatus === "idle" && (
            <div className="space-y-4">
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                <h3 className="font-semibold text-amber-900 dark:text-amber-100 mb-2">偵測到的問題：</h3>
                <ul className="text-sm text-amber-800 dark:text-amber-200 space-y-1">
                  <li>• win32com.gen_py 模組快取損壞</li>
                  <li>• CLSIDToClassMap 屬性缺失</li>
                  <li>• 可能由 Office 更新或環境變更導致</li>
                </ul>
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">修復將執行：</h3>
                <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                  <li>• 清除損壞的 COM 快取檔案</li>
                  <li>• 重新生成 Excel COM 物件包裝器</li>
                  <li>• 驗證修復結果</li>
                </ul>
              </div>
            </div>
          )}

          {repairStatus === "repairing" && (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="w-12 h-12 text-blue-600 dark:text-blue-400 animate-spin mb-4" />
              <p className="text-slate-700 dark:text-slate-300 font-medium">正在修復 win32com...</p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">請稍候，這可能需要幾秒鐘</p>
            </div>
          )}

          {repairStatus === "success" && (
            <div className="flex flex-col items-center justify-center py-8">
              <CheckCircle className="w-12 h-12 text-emerald-600 dark:text-emerald-400 mb-4" />
              <p className="text-slate-700 dark:text-slate-300 font-medium">修復成功！</p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">win32com 快取已重建完成</p>
            </div>
          )}

          {repairStatus === "error" && (
            <div className="space-y-4">
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <h3 className="font-semibold text-red-900 dark:text-red-100 mb-2">修復失敗：</h3>
                <p className="text-sm text-red-800 dark:text-red-200">{errorMessage}</p>
              </div>
              
              <div className="bg-slate-50 dark:bg-slate-900/20 border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">手動修復方法：</h3>
                <ol className="text-sm text-slate-700 dark:text-slate-300 space-y-1 list-decimal list-inside">
                  <li>開啟命令提示字元或 PowerShell</li>
                  <li>執行: <code className="bg-slate-200 dark:bg-slate-700 px-1 rounded">python -c "import win32com.client; win32com.client.gencache.Rebuild()"</code></li>
                  <li>重新啟動應用程式</li>
                </ol>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-3">
          {repairStatus === "idle" && (
            <>
              <button
                onClick={onClose}
                className="px-4 py-2 text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleRepair}
                disabled={isRepairing}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors flex items-center gap-2"
              >
                {isRepairing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    修復中...
                  </>
                ) : (
                  <>
                    <Wrench className="w-4 h-4" />
                    開始修復
                  </>
                )}
              </button>
            </>
          )}
          
          {repairStatus === "error" && (
            <>
              <button
                onClick={() => setRepairStatus("idle")}
                className="px-4 py-2 text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors"
              >
                重試
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors"
              >
                關閉
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
