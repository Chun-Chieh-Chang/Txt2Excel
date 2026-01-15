// Txt2Excel Web App - Main Script
// 全局變量
let txtData = [];
let excelWorkbook = null;
let excelFileName = '';
let rules = [];
let currentEditingRuleIndex = -1;

// DOM 元素
const txtFileInput = document.getElementById('txtFileInput');
const txtUploadArea = document.getElementById('txtUploadArea');
const txtFileInfo = document.getElementById('txtFileInfo');
const txtFileName = document.getElementById('txtFileName');
const txtCount = document.getElementById('txtCount');
const txtPreview = document.getElementById('txtPreview');
const txtPreviewList = document.getElementById('txtPreviewList');
const txtClearBtn = document.getElementById('txtClearBtn');

const excelFileInput = document.getElementById('excelFileInput');
const excelUploadArea = document.getElementById('excelUploadArea');
const excelFileInfo = document.getElementById('excelFileInfo');
const excelFileName_el = document.getElementById('excelFileName');
const excelSheetCount = document.getElementById('excelSheetCount');
const sheetSelector = document.getElementById('sheetSelector');
const sheetSelect = document.getElementById('sheetSelect');
const excelClearBtn = document.getElementById('excelClearBtn');

const configSection = document.getElementById('configSection');
const rulesList = document.getElementById('rulesList');
const addRuleBtn = document.getElementById('addRuleBtn');

const actionSection = document.getElementById('actionSection');
const progressPanel = document.getElementById('progressPanel');
const progressBar = document.getElementById('progressBar');
const progressText = document.getElementById('progressText');
const progressStats = document.getElementById('progressStats');
const executeBtn = document.getElementById('executeBtn');
const resetBtn = document.getElementById('resetBtn');

const ruleModal = document.getElementById('ruleModal');
const ruleSheetSelect = document.getElementById('ruleSheetSelect');
const ruleStartCell = document.getElementById('ruleStartCell');
const ruleCount = document.getElementById('ruleCount');
const rulePreviewText = document.getElementById('rulePreviewText');
const modalCloseBtn = document.getElementById('modalCloseBtn');
const modalCancelBtn = document.getElementById('modalCancelBtn');
const modalConfirmBtn = document.getElementById('modalConfirmBtn');

const resultModal = document.getElementById('resultModal');
const resultStats = document.getElementById('resultStats');
const resultCloseBtn = document.getElementById('resultCloseBtn');
const resultOkBtn = document.getElementById('resultOkBtn');
const downloadBtn = document.getElementById('downloadBtn');

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    initEventListeners();
    updateSteps();
});

// 事件監聽器
function initEventListeners() {
    // TXT 文件上傳
    txtUploadArea.addEventListener('click', () => txtFileInput.click());
    txtFileInput.addEventListener('change', handleTxtFileSelect);
    txtUploadArea.addEventListener('dragover', handleDragOver);
    txtUploadArea.addEventListener('dragleave', handleDragLeave);
    txtUploadArea.addEventListener('drop', handleTxtFileDrop);
    txtClearBtn.addEventListener('click', clearTxtFile);

    // Excel 文件上傳
    excelUploadArea.addEventListener('click', () => excelFileInput.click());
    excelFileInput.addEventListener('change', handleExcelFileSelect);
    excelUploadArea.addEventListener('dragover', handleDragOver);
    excelUploadArea.addEventListener('dragleave', handleDragLeave);
    excelUploadArea.addEventListener('drop', handleExcelFileDrop);
    excelClearBtn.addEventListener('click', clearExcelFile);

    // 規則配置
    addRuleBtn.addEventListener('click', openRuleModal);
    modalCloseBtn.addEventListener('click', closeRuleModal);
    modalCancelBtn.addEventListener('click', closeRuleModal);
    modalConfirmBtn.addEventListener('click', confirmRule);
    ruleStartCell.addEventListener('input', updateRulePreview);
    ruleCount.addEventListener('input', updateRulePreview);

    // 執行和重置
    executeBtn.addEventListener('click', executeProcess);
    resetBtn.addEventListener('click', resetAll);

    // 結果對話框
    resultCloseBtn.addEventListener('click', closeResultModal);
    resultOkBtn.addEventListener('click', closeResultModal);
    downloadBtn.addEventListener('click', downloadExcel);
}

// 拖放處理
function handleDragOver(e) {
    e.preventDefault();
    e.currentTarget.classList.add('dragover');
}

function handleDragLeave(e) {
    e.currentTarget.classList.remove('dragover');
}

function handleTxtFileDrop(e) {
    e.preventDefault();
    e.currentTarget.classList.remove('dragover');
    const file = e.dataTransfer.files[0];
    if (file && file.name.endsWith('.txt')) {
        processTxtFile(file);
    }
}

function handleExcelFileDrop(e) {
    e.preventDefault();
    e.currentTarget.classList.remove('dragover');
    const file = e.dataTransfer.files[0];
    if (file && (file.name.endsWith('.xlsx') || file.name.endsWith('.xls'))) {
        processExcelFile(file);
    }
}

// TXT 文件處理
function handleTxtFileSelect(e) {
    const file = e.target.files[0];
    if (file) {
        processTxtFile(file);
    }
}

function processTxtFile(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        const content = e.target.result;
        parseTxtContent(content, file.name);
    };
    reader.readAsText(file);
}

function parseTxtContent(content, filename) {
    txtData = [];
    const lines = content.split('\n');

    for (let line of lines) {
        if (line.includes('=')) {
            const value = line.split('=')[1].trim();
            // 移除尾隨的無意義字符
            const cleaned = value.replace(/[,\s]+$/, '');

            // 如果是空值或無意義值，停止解析
            if (!cleaned || /^[;:,.]+$/.test(cleaned)) {
                break;
            }

            txtData.push(cleaned);
        }
    }

    // 更新 UI
    txtUploadArea.style.display = 'none';
    txtFileInfo.style.display = 'flex';
    txtFileName.textContent = filename;
    txtCount.textContent = `${txtData.length} 筆`;

    // 顯示預覽
    txtPreview.style.display = 'block';
    txtPreviewList.innerHTML = '';
    txtData.slice(0, 20).forEach((value, index) => {
        const item = document.createElement('div');
        item.className = 'preview-item';
        item.textContent = `${index + 1}. ${value}`;
        txtPreviewList.appendChild(item);
    });

    if (txtData.length > 20) {
        const more = document.createElement('div');
        more.className = 'preview-item';
        more.style.textAlign = 'center';
        more.style.color = 'var(--text-secondary)';
        more.textContent = `... 還有 ${txtData.length - 20} 筆數據`;
        txtPreviewList.appendChild(more);
    }

    updateSteps();
}

function clearTxtFile() {
    txtData = [];
    txtFileInput.value = '';
    txtUploadArea.style.display = 'block';
    txtFileInfo.style.display = 'none';
    txtPreview.style.display = 'none';
    txtCount.textContent = '0 筆';
    updateSteps();
}

// Excel 文件處理
function handleExcelFileSelect(e) {
    const file = e.target.files[0];
    if (file) {
        processExcelFile(file);
    }
}

function processExcelFile(file) {
    excelFileName = file.name;
    const reader = new FileReader();
    reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        excelWorkbook = XLSX.read(data, { type: 'array' });

        // 更新 UI
        excelUploadArea.style.display = 'none';
        excelFileInfo.style.display = 'flex';
        excelFileName_el.textContent = file.name;
        excelSheetCount.textContent = `${excelWorkbook.SheetNames.length} 個工作表`;

        // 顯示工作表選擇器
        sheetSelector.style.display = 'block';
        sheetSelect.innerHTML = '';
        excelWorkbook.SheetNames.forEach(name => {
            const option = document.createElement('option');
            option.value = name;
            option.textContent = name;
            sheetSelect.appendChild(option);
        });

        updateSteps();
    };
    reader.readAsArrayBuffer(file);
}

function clearExcelFile() {
    excelWorkbook = null;
    excelFileName = '';
    excelFileInput.value = '';
    excelUploadArea.style.display = 'block';
    excelFileInfo.style.display = 'none';
    sheetSelector.style.display = 'none';
    excelSheetCount.textContent = '0 個工作表';
    rules = [];
    updateRulesList();
    updateSteps();
}

// 規則管理
function openRuleModal(editIndex = -1) {
    if (!excelWorkbook) {
        alert('請先上傳 Excel 文件');
        return;
    }

    currentEditingRuleIndex = editIndex;

    // 填充工作表選項
    ruleSheetSelect.innerHTML = '';
    excelWorkbook.SheetNames.forEach(name => {
        const option = document.createElement('option');
        option.value = name;
        option.textContent = name;
        ruleSheetSelect.appendChild(option);
    });

    // 如果是編輯模式，填充現有值
    if (editIndex >= 0) {
        const rule = rules[editIndex];
        ruleSheetSelect.value = rule.sheet;
        ruleStartCell.value = rule.startCell;
        ruleCount.value = rule.count;
    } else {
        ruleStartCell.value = 'I26';
        ruleCount.value = 8;
    }

    updateRulePreview();
    ruleModal.style.display = 'flex';
}

function closeRuleModal() {
    ruleModal.style.display = 'none';
    currentEditingRuleIndex = -1;
}

function updateRulePreview() {
    const startCell = ruleStartCell.value.toUpperCase();
    const count = parseInt(ruleCount.value) || 0;

    try {
        const match = startCell.match(/^([A-Z]+)(\d+)$/);
        if (!match) {
            rulePreviewText.textContent = '儲存格格式錯誤';
            rulePreviewText.style.color = 'var(--danger-color)';
            return;
        }

        const col = match[1];
        const row = match[2];

        // 計算結束列（橫向，每隔一列）
        const endCol = getColumnLetter(getColumnIndex(col) + (count - 1) * 2);

        rulePreviewText.textContent = `將填入 ${startCell} → ${endCol}${row}`;
        rulePreviewText.style.color = 'var(--primary-color)';
    } catch (e) {
        rulePreviewText.textContent = '儲存格格式錯誤';
        rulePreviewText.style.color = 'var(--danger-color)';
    }
}

function confirmRule() {
    const sheet = ruleSheetSelect.value;
    const startCell = ruleStartCell.value.toUpperCase();
    const count = parseInt(ruleCount.value);

    // 驗證
    if (!startCell.match(/^[A-Z]+\d+$/)) {
        alert('儲存格格式錯誤，請輸入正確格式（例如：A1, I26）');
        return;
    }

    if (count < 1 || count > 100) {
        alert('每頁筆數必須在 1-100 之間');
        return;
    }

    const rule = {
        sheet,
        startCell,
        count,
        direction: 'horizontal'
    };

    if (currentEditingRuleIndex >= 0) {
        rules[currentEditingRuleIndex] = rule;
    } else {
        rules.push(rule);
    }

    updateRulesList();
    closeRuleModal();
    updateSteps();
}

function updateRulesList() {
    if (rules.length === 0) {
        rulesList.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📋</div>
                <div class="empty-text">尚未添加任何規則</div>
                <div class="empty-hint">點擊上方「新增規則」按鈕開始配置</div>
            </div>
        `;
        return;
    }

    rulesList.innerHTML = '';
    rules.forEach((rule, index) => {
        const item = document.createElement('div');
        item.className = 'rule-item';

        const endCol = getColumnLetter(getColumnIndex(rule.startCell.match(/^([A-Z]+)/)[1]) + (rule.count - 1) * 2);
        const row = rule.startCell.match(/\d+$/)[0];

        item.innerHTML = `
            <div class="rule-info">
                <div class="rule-title">規則 ${index + 1}: ${rule.sheet}</div>
                <div class="rule-details">
                    起始: ${rule.startCell} | 筆數: ${rule.count} | 範圍: ${rule.startCell} → ${endCol}${row}
                </div>
            </div>
            <div class="rule-actions">
                <button class="btn-small btn-secondary" onclick="openRuleModal(${index})">編輯</button>
                <button class="btn-small btn-danger" onclick="deleteRule(${index})">刪除</button>
            </div>
        `;

        rulesList.appendChild(item);
    });
}

function deleteRule(index) {
    if (confirm('確定要刪除這條規則嗎？')) {
        rules.splice(index, 1);
        updateRulesList();
        updateSteps();
    }
}

// 執行處理
async function executeProcess() {
    if (txtData.length === 0) {
        alert('請先上傳 TXT 文件');
        return;
    }

    if (!excelWorkbook) {
        alert('請先上傳 Excel 文件');
        return;
    }

    if (rules.length === 0) {
        alert('請至少添加一條規則');
        return;
    }

    // 確認
    const totalCapacity = rules.reduce((sum, rule) => sum + rule.count, 0);
    if (txtData.length > totalCapacity) {
        if (!confirm(`資料共 ${txtData.length} 筆，但規則只能填入 ${totalCapacity} 筆\n是否繼續？`)) {
            return;
        }
    }

    // 顯示進度
    progressPanel.style.display = 'block';
    executeBtn.disabled = true;

    let dataIndex = 0;
    const totalData = txtData.length;

    try {
        for (const rule of rules) {
            if (dataIndex >= totalData) break;

            const sheet = excelWorkbook.Sheets[rule.sheet];
            if (!sheet) continue;

            const match = rule.startCell.match(/^([A-Z]+)(\d+)$/);
            if (!match) continue;

            const startCol = match[1];
            const startRow = parseInt(match[2]);

            updateProgress(dataIndex, totalData, `處理 ${rule.sheet}`);

            for (let i = 0; i < rule.count && dataIndex < totalData; i++) {
                // 橫向填入，每隔一列
                const col = getColumnLetter(getColumnIndex(startCol) + i * 2);
                const cellAddress = col + startRow;

                // 寫入數據
                sheet[cellAddress] = {
                    t: 's',  // string type
                    v: txtData[dataIndex]
                };

                dataIndex++;
                updateProgress(dataIndex, totalData, `處理 ${rule.sheet}`);

                // 模擬異步處理
                await new Promise(resolve => setTimeout(resolve, 10));
            }
        }

        updateProgress(totalData, totalData, '完成');

        // 顯示結果
        showResult(dataIndex, totalData, rules.length);

    } catch (error) {
        alert('執行時發生錯誤：' + error.message);
        console.error(error);
    } finally {
        executeBtn.disabled = false;
    }
}

function updateProgress(current, total, status) {
    const percentage = total > 0 ? Math.round((current / total) * 100) : 0;
    progressBar.style.width = percentage + '%';
    progressText.textContent = status;
    progressStats.textContent = `${current} / ${total} (${percentage}%)`;
}

function showResult(filled, total, ruleCount) {
    const percentage = total > 0 ? Math.round((filled / total) * 100) : 0;
    resultStats.innerHTML = `
        已填入資料：<strong>${filled} / ${total} 筆</strong><br>
        使用規則：<strong>${ruleCount} 條</strong><br>
        完成率：<strong>${percentage}%</strong>
    `;
    resultModal.style.display = 'flex';
}

function closeResultModal() {
    resultModal.style.display = 'none';
}

function downloadExcel() {
    if (!excelWorkbook) return;

    const wbout = XLSX.write(excelWorkbook, {
        bookType: 'xlsx',
        type: 'array'
    });

    const blob = new Blob([wbout], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = excelFileName.replace(/\.[^.]+$/, '_filled.xlsx');
    a.click();
    URL.revokeObjectURL(url);

    closeResultModal();
}

// 重置
function resetAll() {
    if (!confirm('確定要重置所有設定嗎？')) return;

    clearTxtFile();
    clearExcelFile();
    progressPanel.style.display = 'none';
    progressBar.style.width = '0%';
}

// 步驟更新
function updateSteps() {
    const steps = document.querySelectorAll('.step-item');

    // Step 1: TXT uploaded
    if (txtData.length > 0) {
        steps[0].classList.add('active');
    } else {
        steps[0].classList.remove('active');
    }

    // Step 2: Excel uploaded
    if (excelWorkbook) {
        steps[1].classList.add('active');
    } else {
        steps[1].classList.remove('active');
    }

    // Step 3: Rules configured
    if (rules.length > 0) {
        steps[2].classList.add('active');
        configSection.style.display = 'block';
    } else {
        steps[2].classList.remove('active');
    }

    // Step 4: Ready to execute
    if (txtData.length > 0 && excelWorkbook && rules.length > 0) {
        steps[3].classList.add('active');
        actionSection.style.display = 'block';
    } else {
        steps[3].classList.remove('active');
        actionSection.style.display = 'none';
    }

    // Show config section if Excel is uploaded
    if (excelWorkbook) {
        configSection.style.display = 'block';
    } else {
        configSection.style.display = 'none';
    }
}

// 輔助函數
function getColumnIndex(col) {
    let index = 0;
    for (let i = 0; i < col.length; i++) {
        index = index * 26 + (col.charCodeAt(i) - 64);
    }
    return index;
}

function getColumnLetter(index) {
    let letter = '';
    while (index > 0) {
        const remainder = (index - 1) % 26;
        letter = String.fromCharCode(65 + remainder) + letter;
        index = Math.floor((index - 1) / 26);
    }
    return letter;
}
