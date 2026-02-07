
import { useState, useRef, useEffect } from 'react';
import jschardet from 'jschardet';
import {
  parseTxtContent,
  parseCsvContent,
  getExcelSheets,
  executeFill
} from './logic';
import { Rule, CsvParseResult, ParsedData, ProgressState, Profile, ProfileLibrary } from './types/index';

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import StepIndicator from './components/StepIndicator';
import FileUpload from './components/FileUpload';
import DataPreview from './components/DataPreview';
import { default as RuleCanvasComponent } from './components/RuleCanvas'; // Avoiding name clash with Rule type
import ActionPanel from './components/ActionPanel';
import RuleModal from './components/RuleModal';
import CsvSelectionModal from './components/CsvSelectionModal';
import HelpModal from './components/HelpModal';
import ProfileManager from './components/ProfileManager';
import SheetSelectionModal from './components/SheetSelectionModal';
import ProductSelectionModal from './components/ProductSelectionModal';

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
  const [selectedHeaders, setSelectedHeaders] = useState<Set<string>>(new Set());
  const [showHelpDialog, setShowHelpDialog] = useState(false);

  // Sheet Selection State
  const [showSheetDialog, setShowSheetDialog] = useState(false);
  const [pendingProfile, setPendingProfile] = useState<Profile | null>(null);
  const [deferredProfile, setDeferredProfile] = useState<Profile | null>(null); // New: Store profile if Excel not ready

  // Product Selection State (Library)
  const [showProductDialog, setShowProductDialog] = useState(false);
  const [loadedLibrary, setLoadedLibrary] = useState<ProfileLibrary>([]);

  // Rule Dialog Form State
  const [ruleForm, setRuleForm] = useState<{
    worksheet: string;
    startCell: string;
    rowCount: number;
    direction: 'horizontal' | 'vertical';
    source: string;
  }>({
    worksheet: '',
    startCell: 'I26',
    rowCount: 8,
    direction: 'horizontal',
    source: ''
  });

  const [progress, setProgress] = useState<ProgressState>({ percent: 0, current: 0, total: 0, status: '準備就緒' });
  const [isProcessing, setIsProcessing] = useState(false);

  // Refs
  const workbookRef = useRef<any>(null);

  // --- Handlers ---

  const handleDataUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setDataFile(file);

    // Check file extension
    const isCsv = file.name.toLowerCase().endsWith('.csv');

    const reader = new FileReader();
    reader.onload = (event) => {
      const buffer = event.target?.result as ArrayBuffer;
      if (!buffer) return;

      // 1. Detect Encoding
      // Create a binary string from the buffer for detection (optimizing performance by checking first 4KB)
      const uint8Array = new Uint8Array(buffer);
      let binaryString = '';
      const len = Math.min(uint8Array.length, 4096);
      for (let i = 0; i < len; i++) {
        binaryString += String.fromCharCode(uint8Array[i]);
      }

      const detected = jschardet.detect(binaryString);
      let encoding = detected.encoding || 'utf-8';

      console.log('Detected encoding:', encoding);

      // Common fallback adjustments for Traditional Chinese environments
      if (encoding.toLowerCase() === 'windows-1252' && navigator.language.includes('zh')) {
        // Sometimes Big5 is misidentified as windows-1252 in simple ASCII+ mix files
        // But let's trust jschardet usually, unless we want to force Big5 fallback? 
        // Let's rely on jschardet for now but ensure we handle 'GB2312'/'Big5' correctly by TextDecoder
      }

      // 2. Decode content
      let content = '';
      try {
        const decoder = new TextDecoder(encoding);
        content = decoder.decode(uint8Array);
      } catch (e) {
        console.warn('Decoding failed, falling back to UTF-8', e);
        const decoder = new TextDecoder('utf-8');
        content = decoder.decode(uint8Array);
      }

      if (isCsv) {
        // CSV Workflow
        const result = parseCsvContent(content);
        setCsvResult(result);
        setSelectedHeaders(new Set(result.headers)); // Default select all
        setShowCsvDialog(true);
      } else {
        // TXT Workflow (Legacy)
        const data = parseTxtContent(content);
        setParsedData(data);
      }
    };
    reader.readAsArrayBuffer(file); // Read as binary to detect encoding
  };

  const handleCsvImportConfirm = () => {
    if (!csvResult) return;

    const newParsedData: Record<string, string[]> = {};
    selectedHeaders.forEach(header => {
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

      // Default rule worksheet
      if (result.sheetNames.length > 0) {
        setRuleForm(prev => ({ ...prev, worksheet: result.sheetNames[Math.max(0, result.sheetNames.length - 1)] }));
      }
    } catch (err: any) {
      alert(err.message);
      setExcelFile(null);
    }
  };

  const openAddRule = () => {
    setEditingRuleId(null);
    setRuleForm({
      worksheet: worksheets.length > 0 ? worksheets[worksheets.length - 1] : '', // Default to last sheet
      startCell: 'I26',
      rowCount: 8,
      direction: 'horizontal',
      source: Array.isArray(parsedData) ? '' : (Object.keys(parsedData)[0] || '')
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
      source: rule.source || (Array.isArray(parsedData) ? '' : (Object.keys(parsedData)[0] || ''))
    });
    setShowRuleDialog(true);
  };

  const saveRule = () => {
    if (!ruleForm.worksheet) {
      alert('請選擇工作表');
      return;
    }
    if (!/^[A-Z]+\d+$/.test(ruleForm.startCell)) {
      alert('起始儲存格格式錯誤 (例如 I26)');
      return;
    }

    const newRule: Rule = {
      id: editingRuleId || Date.now().toString(),
      worksheet: ruleForm.worksheet,
      startCell: ruleForm.startCell,
      rowCount: Number(ruleForm.rowCount),
      direction: ruleForm.direction,
      source: ruleForm.source
    };

    if (editingRuleId) {
      setRules(rules.map(r => r.id === editingRuleId ? newRule : r));
    } else {
      setRules([...rules, newRule]);
    }
    setShowRuleDialog(false);

    // Auto advance step if we have rules and files
    if (dataFile && excelFile) setCurrentStep(3);
  };

  const deleteRule = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('確定刪除此規則？')) {
      setRules(rules.filter(r => r.id !== id));
    }
  };

  const resetAll = () => {
    if (confirm('確定重置所有資料與設定？')) {
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
    setProgress({ percent: 0, current: 0, total: 0, status: '準備就緒' });
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
        excelFile?.name || 'result.xlsx',
        (percent, current, total, status) => {
          setProgress({ percent, current, total, status });
        }
      );

      alert("處理完成！");
      setProgress(p => ({ ...p, status: '處理完成' }));
    } catch (err: any) {
      console.error(err);
      alert(`錯誤: ${err.message}`);
      setProgress(p => ({ ...p, status: '發生錯誤' }));
    } finally {
      setIsProcessing(false);
    }
  };

  // Auto-Update Step logic
  useEffect(() => {
    const hasData = Array.isArray(parsedData) ? parsedData.length > 0 : Object.keys(parsedData).length > 0;

    if (isProcessing) return; // Don't change steps processing

    if (rules.length > 0 && hasData && workbookRef.current) {
      setCurrentStep(3);
    } else if (hasData && workbookRef.current) {
      setCurrentStep(3); // Ready to add rules
    } else if (hasData) {
      setCurrentStep(2); // Ready to upload excel
    } else {
      setCurrentStep(1);
    }

    // New: Check for deferred profile application
    if (workbookRef.current && worksheets.length > 0 && deferredProfile) {
      setPendingProfile(deferredProfile);
      setDeferredProfile(null);
      setShowSheetDialog(true);
      // Maybe a toast here? "Excel Detected. Preparing to apply profile..."
    }

  }, [rules.length, parsedData, isProcessing, excelFile, worksheets, deferredProfile]);

  // Handle CSV Header Toggle
  const toggleCsvHeader = (header: string) => {
    const newSet = new Set(selectedHeaders);
    if (newSet.has(header)) newSet.delete(header);
    else newSet.add(header);
    setSelectedHeaders(newSet);
  };



  // Helper validation
  const isValidProfile = (p: any): p is Profile => {
    return p &&
      typeof p.id === 'string' &&
      Array.isArray(p.headers) &&
      Array.isArray(p.rules);
  };

  const loadProfileFromFile = async () => {
    try {
      let content = '';

      // @ts-ignore - FSA API
      if (window.showOpenFilePicker) {
        // @ts-ignore
        const [handle] = await window.showOpenFilePicker({
          types: [{
            description: 'Configuration Profile/Library',
            accept: { 'application/json': ['.json'] },
          }],
          multiple: false
        });
        const file = await handle.getFile();
        content = await file.text();
      } else {
        alert("您的瀏覽器不支援直接開啟檔案 (請使用 Chrome/Edge)。");
        return;
      }

      const parsed = JSON.parse(content);

      if (Array.isArray(parsed)) {
        // Library Mode
        const validProfiles = parsed.filter(isValidProfile);
        if (validProfiles.length === 0) {
          alert("檔案中沒有有效的設定檔資料");
          return;
        }
        setLoadedLibrary(validProfiles);
        setShowProductDialog(true);
      } else if (isValidProfile(parsed)) {
        // Single Profile Mode
        handleLoadProfile(parsed);
      } else {
        throw new Error("檔案格式不符 (缺少必要欄位)");
      }

    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.error("Load failed:", err);
        alert("載入失敗: " + err.message);
      }
    }
  };

  const handleProductSelect = (selectedProfiles: Profile[]) => {
    if (selectedProfiles.length === 0) return;

    const selected = selectedProfiles[0];
    setShowProductDialog(false);

    // Delay slightly to allow modal to close smoothly? Not necessary but good UX
    handleLoadProfile(selected);
  };


  const handleLoadProfile = (profile: Profile) => {
    // 1. Restore Headers (Always allowed)
    const newSelectedHeaders = new Set(profile.headers);
    setSelectedHeaders(newSelectedHeaders);

    // Automatically re-parse CSV data if available
    if (csvResult) {
      const newParsedData: Record<string, string[]> = {};
      profile.headers.forEach(header => {
        if (csvResult.columns[header]) {
          newParsedData[header] = csvResult.columns[header];
        }
      });
      setParsedData(newParsedData);
      setShowCsvDialog(false); // Close modal if open
    }

    // 2. Check Excel for Rules
    if (!workbookRef.current || worksheets.length === 0) {
      // If no Excel, DEFER the application
      setDeferredProfile(profile);
      alert(`已載入設定檔 "${profile.name}" 的欄位設定。\n\n請繼續上傳 Excel 檔案，系統將自動為您套用填寫規則。`);
      return;
    }

    // 3. Defer Sheet Selection to Modal (UI replaces Prompt)
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

    // Build Rules with Offset
    const newRules: Rule[] = pendingProfile.rules.map((pr, idx) => {
      const targetIndex = startIndex + pr.sheetOffset;
      let targetSheet = '';

      if (targetIndex >= 0 && targetIndex < worksheets.length) {
        targetSheet = worksheets[targetIndex];
      } else {
        targetSheet = `(無效 Sheets: ${targetIndex + 1})`;
      }

      return {
        id: Date.now().toString() + '_' + idx,
        worksheet: targetSheet,
        startCell: pr.startCell,
        rowCount: pr.rowCount,
        direction: pr.direction,
        source: pr.source
      };
    });

    setRules(newRules);
    setShowSheetDialog(false);
    setPendingProfile(null);

    // Auto-advance step if needed
    if (dataFile && excelFile) setCurrentStep(3);

    alert(`成功載入設定檔 "${pendingProfile.name}"！已套用 ${newRules.length} 條規則。`);
  };

  // State to hold the file handle for the current loaded library
  const [currentLibraryHandle, setCurrentLibraryHandle] = useState<any>(null);

  const handleProfileRename = async (id: string, newName: string) => {
    if (!newName.trim()) return;

    // 1. Update State
    const updatedLibrary = loadedLibrary.map(p =>
      p.id === id ? { ...p, name: newName.trim() } : p
    );
    setLoadedLibrary(updatedLibrary);

    // 2. Write to File (if handle exists)
    if (currentLibraryHandle) {
      try {
        // @ts-ignore
        const writable = await currentLibraryHandle.createWritable();
        await writable.write(JSON.stringify(updatedLibrary, null, 2));
        await writable.close();
        // Maybe toast success?
      } catch (err: any) {
        console.error("Failed to save rename:", err);
        alert("更名失敗 (無法寫入檔案): " + err.message);
      }
    }
  };

  const handleProfileDelete = async (id: string) => {
    // 1. Update State
    const updatedLibrary = loadedLibrary.filter(p => p.id !== id);
    setLoadedLibrary(updatedLibrary);

    // 2. Write to File (if handle exists)
    if (currentLibraryHandle) {
      try {
        // @ts-ignore
        const writable = await currentLibraryHandle.createWritable();
        await writable.write(JSON.stringify(updatedLibrary, null, 2));
        await writable.close();
      } catch (err: any) {
        console.error("Failed to save deletion:", err);
        alert("刪除失敗 (無法寫入檔案): " + err.message);
      }
    }

    // 3. If library is now empty, close the modal
    if (updatedLibrary.length === 0) {
      setShowProductDialog(false);
      setCurrentLibraryHandle(null);
      alert("設定檔庫已清空");
    }
  };


  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">

      <Header onReset={resetAll} onOpenHelp={() => setShowHelpDialog(true)} />

      {/* MIYAZAKI STYLE BACKGROUND LAYERS */}
      <div className="fixed inset-0 pointer-events-none select-none z-0 overflow-hidden">

        {/* LIGHT MODE: Moving Clouds & Blue Sky */}
        <div className="absolute inset-0 opacity-100 dark:opacity-0 transition-opacity duration-1000">
          {/* Cloud 1 */}
          <div className="absolute top-[5%] -left-[20%] w-[60vh] h-[20vh] bg-white rounded-full blur-3xl opacity-80 animate-[float-cloud_45s_linear_infinite]" />
          {/* Cloud 2 */}
          <div className="absolute top-[15%] -left-[10%] w-[40vh] h-[15vh] bg-white rounded-full blur-2xl opacity-60 animate-[float-cloud_35s_linear_infinite_delay-10s]" style={{ animationDelay: '-15s' }} />
          {/* Cloud 3 */}
          <div className="absolute top-[40%] -left-[20%] w-[70vh] h-[25vh] bg-slate-50 rounded-full blur-3xl opacity-40 animate-[float-cloud_60s_linear_infinite]" style={{ animationDelay: '-5s' }} />
        </div>

        {/* DARK MODE: Enchanted Forest & Fireflies */}
        <div className="absolute inset-0 opacity-0 dark:opacity-100 transition-opacity duration-1000 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-black">
          {/* Firefly 1 */}
          <div className="absolute top-[20%] left-[20%] w-2 h-2 bg-yellow-200 rounded-full shadow-[0_0_10px_2px_rgba(255,255,200,0.6)] animate-pulse" style={{ animationDuration: '3s' }} />
          {/* Firefly 2 */}
          <div className="absolute top-[60%] right-[30%] w-3 h-3 bg-green-200 rounded-full shadow-[0_0_15px_3px_rgba(200,255,200,0.4)] animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }} />
          {/* Soot Sprites (Makkuro Kurosuke) - CSS Blobs */}
          <div className="absolute bottom-10 left-10 w-8 h-8 bg-black rounded-full blur-[1px] animate-bounce duration-[2s]">
            <div className="absolute top-2 left-2 w-2 h-2 bg-white rounded-full"><div className="absolute top-1 left-1 w-0.5 h-0.5 bg-black rounded-full" /></div>
            <div className="absolute top-2 right-2 w-2 h-2 bg-white rounded-full"><div className="absolute top-1 left-0.5 w-0.5 h-0.5 bg-black rounded-full" /></div>
          </div>
          {/* Forest Silhouettes (Gradient Shapes) */}
          <div className="absolute bottom-0 left-0 right-0 h-[20vh] bg-gradient-to-t from-slate-950 to-transparent opacity-80" />
        </div>

      </div>

      <main className="mx-auto max-w-7xl px-6 py-8 relative z-10">

        <StepIndicator currentStep={currentStep} />

        <div className="grid gap-8 lg:grid-cols-12">

          {/* LEFT COLUMN - INPUTS */}
          <div className="space-y-6 lg:col-span-5">
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

          {/* RIGHT COLUMN - RULES & EXECUTE */}
          <div className="space-y-6 lg:col-span-7">

            <ProfileManager
              currentRules={rules}
              currentHeaders={Array.from(selectedHeaders)}
              worksheets={worksheets}
              onLoadProfile={handleLoadProfile}
              onLoadLibrary={(library, handle) => {
                setLoadedLibrary(library);
                setCurrentLibraryHandle(handle); // Store handle
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

      </main>

      <Footer />

      {/* MODALS */}
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
        onCancel={() => {
          setShowSheetDialog(false);
          setPendingProfile(null);
        }}
      />

      <ProductSelectionModal
        isOpen={showProductDialog}
        profiles={loadedLibrary}
        onConfirm={handleProductSelect}
        onCancel={() => {
          setShowProductDialog(false);
          setLoadedLibrary([]);
          setCurrentLibraryHandle(null);
        }}
        onRename={handleProfileRename}
        onDelete={handleProfileDelete}
      />

      <HelpModal
        isOpen={showHelpDialog}
        onClose={() => setShowHelpDialog(false)}
      />

    </div>
  );
}
