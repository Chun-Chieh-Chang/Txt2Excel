
import { useState, useRef, useEffect } from "react";
import jschardet from "jschardet";
import {
  parseTxtContent,
  parseCsvContent,
  getExcelSheets,
  executeFill,
} from "./logic";
import {
  Rule,
  CsvParseResult,
  ParsedData,
  ProgressState,
  Profile,
  ProfileLibrary,
} from "./types/index";

// Components
import Header from "./components/Header";
import Footer from "./components/Footer";
import StepIndicator from "./components/StepIndicator";
import FileUpload from "./components/FileUpload";
import DataPreview from "./components/DataPreview";
import { default as RuleCanvasComponent } from "./components/RuleCanvas";
import ActionPanel from "./components/ActionPanel";
import RuleModal from "./components/RuleModal";
import CsvSelectionModal from "./components/CsvSelectionModal";
import HelpModal from "./components/HelpModal";
import ProfileManager from "./components/ProfileManager";
import SheetSelectionModal from "./components/SheetSelectionModal";
import ProductSelectionModal from "./components/ProductSelectionModal";
import Win32ComRepairModal from "./components/Win32ComRepairModal";
import { detectWin32ComError } from "./utils/win32comRepair";

export default function App() {
  const [parsedData, setParsedData] = useState<ParsedData>([]);
  const [dataFile, setDataFile] = useState<File | null>(null);

  const [worksheets, setWorksheets] = useState<string[]>([]);
  const [excelFile, setExcelFile] = useState<File | null>(null);

  const [rules, setRules] = useState<Rule[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [showRuleDialog, setShowRuleDialog] = useState(false);
  const [editingRuleId, setEditingRuleId] = useState<string | null>(null);

  // CSV Selection State
  const [csvResult, setCsvResult] = useState<CsvParseResult | null>(null);
  const [showCsvDialog, setShowCsvDialog] = useState(false);
  const [selectedHeaders, setSelectedHeaders] = useState<Set<string>>(
    new Set(),
  );
  const [showHelpDialog, setShowHelpDialog] = useState(false);

  // Sheet Selection State
  const [showSheetDialog, setShowSheetDialog] = useState(false);
  const [pendingProfile, setPendingProfile] = useState<Profile | null>(null);
  const [deferredProfile, setDeferredProfile] = useState<Profile | null>(null);

  // Product Selection State (Library)
  const [showProductDialog, setShowProductDialog] = useState(false);
  const [loadedLibrary, setLoadedLibrary] = useState<ProfileLibrary>([]);

  // Win32Com Repair State
  const [showRepairDialog, setShowRepairDialog] = useState(false);

  // Rule Dialog Form State
  const [ruleForm, setRuleForm] = useState<{
    worksheet: string;
    startCell: string;
    rowCount: number;
    direction: "horizontal" | "vertical";
    source: string;
  }>({
    worksheet: "",
    startCell: "I26",
    rowCount: 8,
    direction: "horizontal",
    source: "",
  });

  const [progress, setProgress] = useState<ProgressState>({
    percent: 0,
    current: 0,
    total: 0,
    status: "準備就緒",
  });
  const [isProcessing, setIsProcessing] = useState(false);

  // Refs
  const workbookRef = useRef<any>(null);

  // --- Handlers ---

  const handleDataUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setDataFile(file);
    const isCsv = file.name.toLowerCase().endsWith(".csv");

    const reader = new FileReader();
    reader.onload = (event) => {
      const buffer = event.target?.result as ArrayBuffer;
      if (!buffer) return;

      const uint8Array = new Uint8Array(buffer);
      let binaryString = "";
      const len = Math.min(uint8Array.length, 4096);
      for (let i = 0; i < len; i++) {
        binaryString += String.fromCharCode(uint8Array[i]);
      }

      const detected = jschardet.detect(binaryString);
      let encoding = detected.encoding || "utf-8";

      let content = "";
      try {
        const decoder = new TextDecoder(encoding);
        content = decoder.decode(uint8Array);
      } catch (e) {
        const decoder = new TextDecoder("utf-8");
        content = decoder.decode(uint8Array);
      }

      if (isCsv) {
        const result = parseCsvContent(content);
        setCsvResult(result);
        setSelectedHeaders(new Set(result.headers));
        setShowCsvDialog(true);
      } else {
        const data = parseTxtContent(content);
        setParsedData(data);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleCsvImportConfirm = () => {
    if (!csvResult) return;
    const newParsedData: Record<string, string[]> = {};
    selectedHeaders.forEach((header) => {
      if (csvResult.columns[header]) {
        newParsedData[header] = csvResult.columns[header];
      }
    });
    setParsedData(newParsedData);
    setShowCsvDialog(false);
  };

  const handleExcelUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const result = await getExcelSheets(file);
      workbookRef.current = result.workbook;
      setWorksheets(result.sheetNames);
      setExcelFile(file);
      if (result.sheetNames.length > 0) {
        setRuleForm((prev) => ({
          ...prev,
          worksheet: result.sheetNames[Math.max(0, result.sheetNames.length - 1)],
        }));
      }
    } catch (err: any) {
      // 檢查是否為 win32com 錯誤
      const win32ComDetection = detectWin32ComError(err);
      if (win32ComDetection.isWin32ComError && win32ComDetection.canAutoRepair) {
        setShowRepairDialog(true);
        return;
      }
      
      alert(err.message);
      setExcelFile(null);
    }
  };

  const openAddRule = () => {
    setEditingRuleId(null);
    setRuleForm({
      worksheet: worksheets.length > 0 ? worksheets[worksheets.length - 1] : "",
      startCell: "I26",
      rowCount: 8,
      direction: "horizontal",
      source: Array.isArray(parsedData) ? "" : Object.keys(parsedData)[0] || "",
    });
    setShowRuleDialog(true);
  };

  const openEditRule = (rule: Rule) => {
    setEditingRuleId(rule.id);
    setRuleForm({
      worksheet: rule.worksheet,
      startCell: rule.startCell,
      rowCount: rule.rowCount,
      direction: rule.direction,
      source: rule.source || (Array.isArray(parsedData) ? "" : Object.keys(parsedData)[0] || ""),
    });
    setShowRuleDialog(true);
  };

  const saveRule = () => {
    if (!ruleForm.worksheet) {
      alert("請選擇工作表");
      return;
    }
    if (!/^[A-Z]+\d+$/.test(ruleForm.startCell)) {
      alert("起始儲存格格式錯誤 (例如 I26)");
      return;
    }
    const newRule: Rule = {
      id: editingRuleId || Date.now().toString(),
      worksheet: ruleForm.worksheet,
      startCell: ruleForm.startCell,
      rowCount: Number(ruleForm.rowCount),
      direction: ruleForm.direction,
      source: ruleForm.source,
    };
    if (editingRuleId) {
      setRules(rules.map((r) => (r.id === editingRuleId ? newRule : r)));
    } else {
      setRules([...rules, newRule]);
    }
    setShowRuleDialog(false);
  };

  const deleteRule = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("確定刪除此規則？")) {
      setRules(rules.filter((r) => r.id !== id));
    }
  };

  const resetAll = () => {
    if (confirm("確定重置所有資料與設定？")) {
      resetState();
    }
  };

  const resetState = () => {
    setDataFile(null);
    setExcelFile(null);
    setParsedData([]);
    setWorksheets([]);
    setRules([]);
    setCurrentStep(1);
    setProgress({ percent: 0, current: 0, total: 0, status: "準備就緒" });
    workbookRef.current = null;
    setCsvResult(null);
    setSelectedHeaders(new Set());
  };

  const executeProcess = async () => {
    if (!workbookRef.current || !dataFile) return;
    setIsProcessing(true);
    try {
      await executeFill(
        workbookRef.current,
        parsedData,
        rules,
        excelFile?.name || "result.xlsx",
        (percent, current, total, status) => {
          setProgress({ percent, current, total, status });
        },
      );
      alert("處理完成！");
      setProgress((p) => ({ ...p, status: "處理完成" }));
    } catch (err: any) {
      console.error(err);
      
      // 檢查是否為 win32com 錯誤
      const win32ComDetection = detectWin32ComError(err);
      if (win32ComDetection.isWin32ComError && win32ComDetection.canAutoRepair) {
        setShowRepairDialog(true);
        return;
      }
      
      alert(`錯誤: ${err.message}`);
      setProgress((p) => ({ ...p, status: "發生錯誤" }));
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    const hasData = Array.isArray(parsedData) ? parsedData.length > 0 : Object.keys(parsedData).length > 0;
    if (isProcessing) return;
    if (rules.length > 0 && hasData && workbookRef.current) {
      setCurrentStep(4);
    } else if (hasData && workbookRef.current) {
      setCurrentStep(3);
    } else if (hasData) {
      setCurrentStep(2);
    } else {
      setCurrentStep(1);
    }
    if (workbookRef.current && worksheets.length > 0 && deferredProfile) {
      setPendingProfile(deferredProfile);
      setDeferredProfile(null);
      setShowSheetDialog(true);
    }
  }, [rules.length, parsedData, isProcessing, excelFile, worksheets, deferredProfile]);

  const toggleCsvHeader = (header: string) => {
    const newSet = new Set(selectedHeaders);
    if (newSet.has(header)) newSet.delete(header);
    else newSet.add(header);
    setSelectedHeaders(newSet);
  };

  const isValidProfile = (p: any): p is Profile => {
    return p && typeof p.id === "string" && Array.isArray(p.headers) && Array.isArray(p.rules);
  };

  const loadProfileFromFile = async () => {
    try {
      let content = "";
      // @ts-ignore
      if (window.showOpenFilePicker) {
        // @ts-ignore
        const [handle] = await window.showOpenFilePicker({
          types: [{ description: "Configuration Profile/Library", accept: { "application/json": [".json"] } }],
          multiple: false,
        });
        const file = await handle.getFile();
        content = await file.text();
      } else {
        alert("您的瀏覽器不支援直接開啟檔案 (請使用 Chrome/Edge)。");
        return;
      }
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) {
        const validProfiles = parsed.filter(isValidProfile);
        if (validProfiles.length === 0) {
          alert("檔案中沒有有效的設定檔資料");
          return;
        }
        setLoadedLibrary(validProfiles);
        setShowProductDialog(true);
      } else if (isValidProfile(parsed)) {
        handleLoadProfile(parsed);
      } else {
        throw new Error("檔案格式不符 (缺少必要欄位)");
      }
    } catch (err: any) {
      if (err.name !== "AbortError") alert("載入失敗: " + err.message);
    }
  };

  const handleProductSelect = (selectedProfiles: Profile[]) => {
    if (selectedProfiles.length === 0) return;
    const selected = selectedProfiles[0];
    setShowProductDialog(false);
    handleLoadProfile(selected);
  };

  const handleLoadProfile = (profile: Profile) => {
    const newSelectedHeaders = new Set(profile.headers);
    setSelectedHeaders(newSelectedHeaders);
    if (csvResult) {
      const newParsedData: Record<string, string[]> = {};
      profile.headers.forEach((header) => {
        if (csvResult.columns[header]) {
          newParsedData[header] = csvResult.columns[header];
        }
      });
      setParsedData(newParsedData);
      setShowCsvDialog(false);
    }
    if (!workbookRef.current || worksheets.length === 0) {
      setDeferredProfile(profile);
      alert(`已載入設定檔 "${profile.name}" 的欄位設定。\n\n請繼續上傳 Excel 檔案，系統將自動為您套用填寫規則。`);
      return;
    }
    setPendingProfile(profile);
    setShowSheetDialog(true);
  };

  const handleSheetConfirm = (startSheet: string) => {
    if (!pendingProfile || !workbookRef.current) return;
    const startIndex = worksheets.indexOf(startSheet);
    if (startIndex === -1) {
      alert("找不到指定的工作表");
      return;
    }
    const newRules: Rule[] = pendingProfile.rules.map((pr, idx) => {
      const targetIndex = startIndex + pr.sheetOffset;
      let targetSheet = "";
      if (targetIndex >= 0 && targetIndex < worksheets.length) {
        targetSheet = worksheets[targetIndex];
      } else {
        targetSheet = `(無效 Sheets: ${targetIndex + 1})`;
      }
      return {
        id: Date.now().toString() + "_" + idx,
        worksheet: targetSheet,
        startCell: pr.startCell,
        rowCount: pr.rowCount,
        direction: pr.direction,
        source: pr.source,
      };
    });
    setRules(newRules);
    setShowSheetDialog(false);
    setPendingProfile(null);
    alert(`成功載入設定檔 "${pendingProfile.name}"！已套用 ${newRules.length} 條規則。`);
  };

  const [currentLibraryHandle, setCurrentLibraryHandle] = useState<any>(null);

  const handleProfileRename = async (id: string, newName: string) => {
    if (!newName.trim()) return;
    const updatedLibrary = loadedLibrary.map((p) => p.id === id ? { ...p, name: newName.trim() } : p);
    setLoadedLibrary(updatedLibrary);
    if (currentLibraryHandle) {
      try {
        // @ts-ignore
        const writable = await currentLibraryHandle.createWritable();
        await writable.write(JSON.stringify(updatedLibrary, null, 2));
        await writable.close();
      } catch (err: any) {
        alert("更名失敗: " + err.message);
      }
    }
  };

  const handleProfileDelete = async (id: string) => {
    const updatedLibrary = loadedLibrary.filter((p) => p.id !== id);
    setLoadedLibrary(updatedLibrary);
    if (currentLibraryHandle) {
      try {
        // @ts-ignore
        const writable = await currentLibraryHandle.createWritable();
        await writable.write(JSON.stringify(updatedLibrary, null, 2));
        await writable.close();
      } catch (err: any) {
        alert("刪除失敗: " + err.message);
      }
    }
    if (updatedLibrary.length === 0) {
      setShowProductDialog(false);
      setCurrentLibraryHandle(null);
      alert("設定檔庫已清空");
    }
  };

  const handleRepairComplete = () => {
    // 修復完成後重置相關狀態
    setProgress({ percent: 0, current: 0, total: 0, status: "準備就緒" });
    
    // 可選：自動重試失敗的操作
    if (dataFile && excelFile && rules.length > 0) {
      setTimeout(() => {
        executeProcess();
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen relative py-8">
      <Header onReset={resetAll} onOpenHelp={() => setShowHelpDialog(true)} />

      <div className="decoration-circle d1"></div>
      <div className="decoration-circle d2"></div>
      <div className="decoration-circle d3"></div>

      <main className="mx-auto max-w-[1400px] px-8 py-12 relative z-10 flex flex-col gap-12">
        <StepIndicator currentStep={currentStep} />

        <div className="grid gap-12 lg:grid-cols-12">
          {/* 左側：檔案與預覽 */}
          <div className="flex flex-col gap-8 lg:col-span-12 xl:col-span-5">
            <FileUpload
              dataFile={dataFile}
              excelFile={excelFile}
              parsedData={parsedData}
              onDataUpload={handleDataUpload}
              onExcelUpload={handleExcelUpload}
              onClearData={() => { setDataFile(null); setParsedData([]); }}
              onClearExcel={() => { setExcelFile(null); setWorksheets([]); workbookRef.current = null; }}
            />
            <DataPreview parsedData={parsedData} />
          </div>

          {/* 右側：規則與執行 */}
          <div className="flex flex-col gap-8 lg:col-span-12 xl:col-span-7">
            <ProfileManager
              currentRules={rules}
              currentHeaders={Array.from(selectedHeaders)}
              worksheets={worksheets}
              onLoadProfile={handleLoadProfile}
              onLoadLibrary={(library, handle) => {
                setLoadedLibrary(library);
                setCurrentLibraryHandle(handle);
                setShowProductDialog(true);
              }}
            />

            <RuleCanvasComponent
              rules={rules}
              onAddRule={openAddRule}
              onEditRule={openEditRule}
              onDeleteRule={deleteRule}
              excelFile={excelFile}
              dataFile={dataFile}
            />

            <ActionPanel
              progress={progress}
              isProcessing={isProcessing}
              onExecute={executeProcess}
              canExecute={!!(dataFile && excelFile && rules.length > 0)}
            />
          </div>
        </div>
        
        <Footer />
      </main>

      {/* 彈窗組件 */}
      <CsvSelectionModal
        isOpen={showCsvDialog}
        csvResult={csvResult}
        selectedHeaders={selectedHeaders}
        onToggleHeader={toggleCsvHeader}
        onSelectAll={() => setSelectedHeaders(new Set(csvResult?.headers || []))}
        onDeselectAll={() => setSelectedHeaders(new Set())}
        onConfirm={handleCsvImportConfirm}
        onCancel={() => setShowCsvDialog(false)}
        onLoadProfile={loadProfileFromFile}
      />

      <RuleModal
        isOpen={showRuleDialog}
        editingRuleId={editingRuleId}
        ruleForm={ruleForm}
        setRuleForm={setRuleForm}
        worksheets={worksheets}
        parsedData={parsedData}
        onSave={saveRule}
        onClose={() => setShowRuleDialog(false)}
      />

      <SheetSelectionModal
        isOpen={showSheetDialog}
        worksheets={worksheets}
        onConfirm={handleSheetConfirm}
        onCancel={() => { setShowSheetDialog(false); setPendingProfile(null); }}
      />

      <ProductSelectionModal
        isOpen={showProductDialog}
        profiles={loadedLibrary}
        onConfirm={handleProductSelect}
        onCancel={() => { setShowProductDialog(false); setLoadedLibrary([]); setCurrentLibraryHandle(null); }}
        onRename={handleProfileRename}
        onDelete={handleProfileDelete}
      />

      <HelpModal isOpen={showHelpDialog} onClose={() => setShowHelpDialog(false)} />
      
      <Win32ComRepairModal
        isOpen={showRepairDialog}
        onClose={() => setShowRepairDialog(false)}
        onRepairComplete={handleRepairComplete}
      />
    </div>
  );
}
