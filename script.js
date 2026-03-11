// 全局状态
let currentDate = new Date(2026, 2, 10); // 2026 年 3 月 10 日
let selectedDate = new Date(2026, 2, 10);
let calendarCurrentMonth = new Date(2026, 2, 1);

// DOM 元素
const loginPage = document.getElementById('login-page');
const mainPage = document.getElementById('main-page');
const passwordInput = document.getElementById('password-input');
const unlockBtn = document.getElementById('unlock-btn');
const logoutBtn = document.getElementById('logout-btn');
const dateDisplay = document.getElementById('date-display');
const calendarBtn = document.getElementById('calendar-btn');
const openCalendarBtn = document.getElementById('open-calendar');
const calendarModal = document.getElementById('calendar-modal');
const calendarYear = document.getElementById('calendar-year');
const calendarTitle = document.getElementById('calendar-title');
const currentMonthYear = document.getElementById('current-month-year');
const calendarDays = document.getElementById('calendar-days');
const prevMonthBtn = document.getElementById('prev-month');
const nextMonthBtn = document.getElementById('next-month');
const clearDateBtn = document.getElementById('clear-date');
const cancelCalendarBtn = document.getElementById('cancel-calendar');
const setDateBtn = document.getElementById('set-date');
const textareas = document.querySelectorAll('.question-textarea');

// 情绪追踪相关元素
const moodBtns = document.querySelectorAll('.mood-btn');
const selectedMoodInput = document.getElementById('selected-mood');

// 初始化
function init() {
    updateDateDisplay();
    loadCurrentDateDataWithMood();
    setupEventListeners();
}

// 获取日期键值
function getDateKey(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// 加载当前日期的数据
function loadCurrentDateData() {
    const dateKey = getDateKey(currentDate);
    const savedData = localStorage.getItem(`journal_${dateKey}`);
    
    if (savedData) {
        const data = JSON.parse(savedData);
        textareas.forEach((textarea, index) => {
            textarea.value = data[index] || '';
        });
    } else {
        // 清空所有文本框
        textareas.forEach(textarea => {
            textarea.value = '';
        });
    }
}

// 保存当前日期的数据
function saveCurrentDateData() {
    const dateKey = getDateKey(currentDate);
    const data = Array.from(textareas).map(textarea => textarea.value);
    localStorage.setItem(`journal_${dateKey}`, JSON.stringify(data));
}

// 设置事件监听器
function setupEventListeners() {
    // 解锁按钮
    unlockBtn.addEventListener('click', handleUnlock);

    // 密码输入框回车事件
    passwordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleUnlock();
        }
    });

    // 退出登录
    logoutBtn.addEventListener('click', handleLogout);

    // 打开日历
    calendarBtn.addEventListener('click', openCalendar);
    openCalendarBtn.addEventListener('click', openCalendar);
    dateDisplay.addEventListener('click', openCalendar);

    // 日历相关
    prevMonthBtn.addEventListener('click', prevMonth);
    nextMonthBtn.addEventListener('click', nextMonth);
    clearDateBtn.addEventListener('click', clearDate);
    cancelCalendarBtn.addEventListener('click', closeCalendar);
    setDateBtn.addEventListener('click', confirmDate);

    // 点击弹窗外部关闭
    calendarModal.addEventListener('click', (e) => {
        if (e.target === calendarModal) {
            closeCalendar();
        }
    });

    // 情绪选择按钮
    moodBtns.forEach(btn => {
        btn.addEventListener('click', () => selectMood(btn.dataset.mood));
    });
}

// 选择情绪
function selectMood(moodValue) {
    // 移除所有选中状态
    moodBtns.forEach(btn => btn.classList.remove('selected'));

    // 添加选中状态
    const selectedBtn = document.querySelector(`.mood-btn[data-mood="${moodValue}"]`);
    if (selectedBtn) {
        selectedBtn.classList.add('selected');
        selectedMoodInput.value = moodValue;
    }
}

// 清除情绪选择
function clearMoodSelection() {
    moodBtns.forEach(btn => btn.classList.remove('selected'));
    selectedMoodInput.value = '';
}

// 加载当前日期的数据（包含情绪）
function loadCurrentDateDataWithMood() {
    const dateKey = getDateKey(currentDate);
    const savedData = localStorage.getItem(`journal_${dateKey}`);

    if (savedData) {
        const data = JSON.parse(savedData);
        // 加载文本内容
        textareas.forEach((textarea, index) => {
            textarea.value = data.answers?.[index] || data[index] || '';
        });
        // 加载情绪
        if (data.mood) {
            selectMood(data.mood);
        } else {
            clearMoodSelection();
        }
    } else {
        // 清空所有文本框和情绪
        textareas.forEach(textarea => {
            textarea.value = '';
        });
        clearMoodSelection();
    }
}

// 保存当前日期的数据（包含情绪）
function saveCurrentDateDataWithMood() {
    const dateKey = getDateKey(currentDate);
    const answers = Array.from(textareas).map(textarea => textarea.value);
    const mood = selectedMoodInput.value;

    const data = {
        answers: answers,
        mood: mood,
        timestamp: new Date().toISOString()
    };

    localStorage.setItem(`journal_${dateKey}`, JSON.stringify(data));
}

// 处理解锁
function handleUnlock() {
    const password = passwordInput.value.trim();
    if (password) {
        loginPage.classList.remove('active');
        mainPage.classList.add('active');
        passwordInput.value = '';
        loadCurrentDateDataWithMood();
    }
}

// 处理退出
function handleLogout() {
    mainPage.classList.remove('active');
    loginPage.classList.add('active');
}

// 更新日期显示
function updateDateDisplay() {
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    dateDisplay.value = `${year}/${month}/${day}`;
}

// 打开日历
function openCalendar() {
    calendarCurrentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    selectedDate = new Date(currentDate);
    renderCalendar();
    calendarModal.classList.add('active');
}

// 关闭日历
function closeCalendar() {
    calendarModal.classList.remove('active');
}

// 渲染日历
function renderCalendar() {
    const year = calendarCurrentMonth.getFullYear();
    const month = calendarCurrentMonth.getMonth();
    
    // 更新标题
    calendarYear.textContent = `${year}年`;
    calendarTitle.textContent = `${month + 1}月`;
    currentMonthYear.textContent = `${year}年${month + 1}月`;
    
    // 获取当月第一天和总天数
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startingDay = firstDay.getDay();
    const totalDays = lastDay.getDate();
    
    // 获取今天的日期
    const today = new Date();
    
    // 清空日历
    calendarDays.innerHTML = '';
    
    // 添加空白格子
    for (let i = 0; i < startingDay; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day empty';
        calendarDays.appendChild(emptyDay);
    }
    
    // 添加日期
    for (let day = 1; day <= totalDays; day++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        dayElement.textContent = day;
        
        // 标记今天
        if (year === today.getFullYear() && 
            month === today.getMonth() && 
            day === today.getDate()) {
            dayElement.classList.add('today');
        }
        
        // 标记选中的日期
        if (year === selectedDate.getFullYear() && 
            month === selectedDate.getMonth() && 
            day === selectedDate.getDate()) {
            dayElement.classList.add('selected');
        }
        
        // 检查该日期是否有数据
        const checkDate = new Date(year, month, day);
        const dateKey = getDateKey(checkDate);
        const savedData = localStorage.getItem(`journal_${dateKey}`);
        if (savedData) {
            dayElement.style.background = 'rgba(255, 171, 171, 0.3)';

            // 检查是否有情绪数据
            try {
                const data = JSON.parse(savedData);
                if (data.mood) {
                    dayElement.classList.add(`mood-${data.mood}`);
                    const moodIndicator = document.createElement('span');
                    moodIndicator.className = 'mood-indicator';
                    dayElement.appendChild(moodIndicator);
                }
            } catch (e) {
                // 兼容旧数据格式
            }
        }
        
        // 点击事件
        dayElement.addEventListener('click', () => selectDate(day));
        
        calendarDays.appendChild(dayElement);
    }
}

// 选择日期
function selectDate(day) {
    const selectedElements = calendarDays.querySelectorAll('.calendar-day.selected');
    selectedElements.forEach(el => el.classList.remove('selected'));

    const dayElements = calendarDays.querySelectorAll('.calendar-day');
    dayElements.forEach(el => {
        if (el.textContent.trim() === day.toString() && !el.classList.contains('empty')) {
            el.classList.add('selected');
        }
    });

    selectedDate = new Date(calendarCurrentMonth.getFullYear(),
                           calendarCurrentMonth.getMonth(),
                           day);

    // 直接切换到选中的日期
    saveCurrentDateDataWithMood();
    currentDate = new Date(selectedDate);
    updateDateDisplay();
    loadCurrentDateDataWithMood();
    closeCalendar();
}

// 上个月
function prevMonth() {
    calendarDays.classList.add('switching');
    setTimeout(() => {
        calendarCurrentMonth.setMonth(calendarCurrentMonth.getMonth() - 1);
        renderCalendar();
        calendarDays.classList.remove('switching');
    }, 200);
}

// 下个月
function nextMonth() {
    calendarDays.classList.add('switching');
    setTimeout(() => {
        calendarCurrentMonth.setMonth(calendarCurrentMonth.getMonth() + 1);
        renderCalendar();
        calendarDays.classList.remove('switching');
    }, 200);
}

// 清除日期
function clearDate() {
    currentDate = new Date();
    selectedDate = new Date();
    updateDateDisplay();
    loadCurrentDateDataWithMood();
    closeCalendar();
}

// 确认日期
function confirmDate() {
    saveCurrentDateDataWithMood(); // 保存当前日期的数据
    currentDate = new Date(selectedDate);
    updateDateDisplay();
    loadCurrentDateDataWithMood(); // 加载新日期的数据
    closeCalendar();
}

// 保存功能
document.querySelector('.action-btn.primary').addEventListener('click', function() {
    const btn = this;
    btn.classList.add('saving');
    saveCurrentDateDataWithMood();
    
    // 移除动画类以便下次触发
    setTimeout(() => {
        btn.classList.remove('saving');
    }, 300);
    
    alert('日志已保存！');
});

// 随机漫步功能
document.querySelectorAll('.action-btn')[1].addEventListener('click', openRandomWalk);

// 情绪统计功能
document.getElementById('mood-stats-btn').addEventListener('click', openMoodStats);

// 随机漫步相关DOM元素
const randomWalkModal = document.getElementById('random-walk-modal');
const randomWalkDate = document.getElementById('random-walk-date');
const randomWalkEntries = document.getElementById('random-walk-entries');
const randomWalkCloseBtn = document.getElementById('random-walk-close');
const randomWalkAgainBtn = document.getElementById('random-walk-again');
const randomWalkJumpBtn = document.getElementById('random-walk-jump');

// 问题列表
const questions = [
    '今天最起波澜的事情是什么？',
    '当时我的第一反应是什么？',
    '我其实是想得到什么？',
    '我其实在害怕什么？',
    '我给自己找了什么理由？',
    '今天捞出来的主石头是什么？',
    '如果明天再遇到同样的事，我该怎么做？'
];

// 当前随机漫步的日期
let currentRandomDate = null;

// 打开随机漫步弹窗
function openRandomWalk() {
    const entries = getAllJournalEntries();
    
    if (entries.length === 0) {
        alert('还没有任何日记记录，先写几篇日记吧！');
        return;
    }
    
    showRandomEntry(entries);
    randomWalkModal.classList.add('active');
}

// 获取所有日记条目
function getAllJournalEntries() {
    const entries = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('journal_')) {
            const dateKey = key.replace('journal_', '');
            const data = JSON.parse(localStorage.getItem(key));
            // 检查是否有实际内容
            const hasContent = data && data.some(item => item && item.trim() !== '');
            if (hasContent) {
                entries.push({
                    dateKey: dateKey,
                    date: parseDateKey(dateKey),
                    data: data
                });
            }
        }
    }
    return entries;
}

// 解析日期键值
function parseDateKey(dateKey) {
    const [year, month, day] = dateKey.split('-').map(Number);
    return new Date(year, month - 1, day);
}

// 格式化日期显示
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    const weekday = weekdays[date.getDay()];
    return `${year}年${month}月${day}日 ${weekday}`;
}

// 显示随机条目
function showRandomEntry(entries) {
    const randomIndex = Math.floor(Math.random() * entries.length);
    const entry = entries[randomIndex];
    currentRandomDate = entry.date;
    
    // 显示日期
    randomWalkDate.textContent = formatDate(entry.date);
    
    // 生成日记内容HTML
    let entriesHTML = '';
    entry.data.forEach((content, index) => {
        if (content && content.trim() !== '') {
            entriesHTML += `
                <div class="random-walk-entry">
                    <div class="random-walk-entry-number">${index + 1}</div>
                    <div class="random-walk-entry-content">
                        <div class="random-walk-entry-question">${questions[index]}</div>
                        <div class="random-walk-entry-text">${escapeHtml(content)}</div>
                    </div>
                </div>
            `;
        }
    });
    
    randomWalkEntries.innerHTML = entriesHTML || '<p class="no-entries">这一天的日记没有内容</p>';
}

// HTML转义
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// 关闭随机漫步弹窗
function closeRandomWalk() {
    randomWalkModal.classList.remove('active');
}

// 再漫步一次
function walkAgain() {
    const entries = getAllJournalEntries();
    if (entries.length > 0) {
        // 避免连续随机到同一天
        let newEntry;
        let attempts = 0;
        do {
            const randomIndex = Math.floor(Math.random() * entries.length);
            newEntry = entries[randomIndex];
            attempts++;
        } while (entries.length > 1 && newEntry.date.getTime() === currentRandomDate?.getTime() && attempts < 10);
        
        showRandomEntry(entries);
    }
}

// 跳转到该日期
function jumpToDate() {
    if (currentRandomDate) {
        saveCurrentDateDataWithMood();
        currentDate = new Date(currentRandomDate);
        updateDateDisplay();
        loadCurrentDateDataWithMood();
        closeRandomWalk();
    }
}

// 随机漫步事件监听
randomWalkCloseBtn.addEventListener('click', closeRandomWalk);
randomWalkAgainBtn.addEventListener('click', walkAgain);
randomWalkJumpBtn.addEventListener('click', jumpToDate);

// 点击弹窗外部关闭
randomWalkModal.addEventListener('click', (e) => {
    if (e.target === randomWalkModal) {
        closeRandomWalk();
    }
});

// 导出功能
document.querySelectorAll('.action-btn')[3].addEventListener('click', openExport);

// 导入功能
document.querySelectorAll('.action-btn')[4].addEventListener('click', openImport);

// 导出导入相关DOM元素
const exportModal = document.getElementById('export-modal');
const exportCount = document.getElementById('export-count');
const exportTime = document.getElementById('export-time');
const exportPreview = document.getElementById('export-preview');
const exportCloseBtn = document.getElementById('export-close');
const exportConfirmBtn = document.getElementById('export-confirm');

const importModal = document.getElementById('import-modal');
const importUploadArea = document.getElementById('import-upload-area');
const importFileInput = document.getElementById('import-file-input');
const importPreview = document.getElementById('import-preview');
const importCount = document.getElementById('import-count');
const importMode = document.getElementById('import-mode');
const importPreviewContent = document.getElementById('import-preview-content');
const importCloseBtn = document.getElementById('import-close');
const importConfirmBtn = document.getElementById('import-confirm');

let currentImportData = null;

// 打开导出弹窗
function openExport() {
    const entries = getAllJournalEntries();
    
    exportCount.textContent = entries.length;
    exportTime.textContent = new Date().toLocaleString('zh-CN');
    
    // 生成预览
    if (entries.length === 0) {
        exportPreview.innerHTML = '<p class="no-data">暂无日记数据</p>';
        exportConfirmBtn.disabled = true;
    } else {
        exportConfirmBtn.disabled = false;
        let previewHTML = '<div class="export-preview-list">';
        entries.slice(0, 5).forEach(entry => {
            const dateStr = formatDate(entry.date);
            const contentCount = entry.data.filter(item => item && item.trim() !== '').length;
            previewHTML += `
                <div class="export-preview-item">
                    <span class="export-preview-date">${dateStr}</span>
                    <span class="export-preview-count">${contentCount} 个回答</span>
                </div>
            `;
        });
        if (entries.length > 5) {
            previewHTML += `<div class="export-preview-more">还有 ${entries.length - 5} 篇日记...</div>`;
        }
        previewHTML += '</div>';
        exportPreview.innerHTML = previewHTML;
    }
    
    exportModal.classList.add('active');
}

// 关闭导出弹窗
function closeExport() {
    exportModal.classList.remove('active');
}

// 确认导出
function confirmExport() {
    const entries = getAllJournalEntries();
    
    if (entries.length === 0) {
        alert('没有可导出的日记数据');
        return;
    }
    
    // 构建导出数据
    const exportData = {
        version: '1.0',
        exportTime: new Date().toISOString(),
        appName: '人选·天选',
        entries: entries.map(entry => ({
            date: entry.dateKey,
            data: entry.data
        }))
    };
    
    // 转换为JSON并下载
    const jsonStr = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `人选天选_日记备份_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    closeExport();
    alert('日记导出成功！');
}

// 打开导入弹窗
function openImport() {
    currentImportData = null;
    importUploadArea.style.display = 'block';
    importPreview.style.display = 'none';
    importConfirmBtn.disabled = true;
    importFileInput.value = '';
    importModal.classList.add('active');
}

// 关闭导入弹窗
function closeImport() {
    importModal.classList.remove('active');
    currentImportData = null;
}

// 处理文件选择
function handleFileSelect(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    processImportFile(file);
}

// 处理拖拽文件
function handleDrop(e) {
    e.preventDefault();
    importUploadArea.classList.remove('dragover');
    
    const files = e.dataTransfer.files;
    if (files.length === 0) return;
    
    const file = files[0];
    if (!file.name.endsWith('.json')) {
        alert('请选择 JSON 格式的文件');
        return;
    }
    
    processImportFile(file);
}

// 处理拖拽悬停
function handleDragOver(e) {
    e.preventDefault();
    importUploadArea.classList.add('dragover');
}

function handleDragLeave(e) {
    e.preventDefault();
    importUploadArea.classList.remove('dragover');
}

// 处理导入文件
function processImportFile(file) {
    const reader = new FileReader();
    
    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target.result);
            
            // 验证数据格式
            if (!data.entries || !Array.isArray(data.entries)) {
                alert('文件格式不正确：缺少日记数据');
                return;
            }
            
            // 过滤有效条目
            const validEntries = data.entries.filter(entry => 
                entry.date && 
                Array.isArray(entry.data) &&
                entry.data.some(item => item && item.trim() !== '')
            );
            
            if (validEntries.length === 0) {
                alert('文件中没有有效的日记数据');
                return;
            }
            
            currentImportData = validEntries;
            
            // 显示预览
            importCount.textContent = validEntries.length;
            importUploadArea.style.display = 'none';
            importPreview.style.display = 'block';
            importConfirmBtn.disabled = false;
            
            // 生成预览列表
            let previewHTML = '<div class="import-preview-list">';
            validEntries.slice(0, 5).forEach(entry => {
                const date = parseDateKey(entry.date);
                const dateStr = formatDate(date);
                const contentCount = entry.data.filter(item => item && item.trim() !== '').length;
                previewHTML += `
                    <div class="import-preview-item">
                        <span class="import-preview-date">${dateStr}</span>
                        <span class="import-preview-count">${contentCount} 个回答</span>
                    </div>
                `;
            });
            if (validEntries.length > 5) {
                previewHTML += `<div class="import-preview-more">还有 ${validEntries.length - 5} 篇日记...</div>`;
            }
            previewHTML += '</div>';
            importPreviewContent.innerHTML = previewHTML;
            
        } catch (error) {
            alert('文件解析失败：' + error.message);
        }
    };
    
    reader.onerror = () => {
        alert('文件读取失败');
    };
    
    reader.readAsText(file);
}

// 确认导入
function confirmImport() {
    if (!currentImportData || currentImportData.length === 0) {
        alert('没有可导入的数据');
        return;
    }
    
    const mode = importMode.value;
    let importedCount = 0;
    let skippedCount = 0;
    
    currentImportData.forEach(entry => {
        const key = `journal_${entry.date}`;
        
        if (mode === 'overwrite') {
            // 覆盖模式：直接写入
            localStorage.setItem(key, JSON.stringify(entry.data));
            importedCount++;
        } else {
            // 合并模式：只有不存在时才写入
            if (!localStorage.getItem(key)) {
                localStorage.setItem(key, JSON.stringify(entry.data));
                importedCount++;
            } else {
                skippedCount++;
            }
        }
    });
    
    let message = `导入完成！\n成功导入 ${importedCount} 篇日记`;
    if (skippedCount > 0) {
        message += `\n跳过 ${skippedCount} 篇（已存在）`;
    }
    alert(message);
    
    closeImport();
}

// 导出导入事件监听
exportCloseBtn.addEventListener('click', closeExport);
exportConfirmBtn.addEventListener('click', confirmExport);

importCloseBtn.addEventListener('click', closeImport);
importConfirmBtn.addEventListener('click', confirmImport);
importFileInput.addEventListener('change', handleFileSelect);

// 点击上传区域触发文件选择
importUploadArea.addEventListener('click', () => {
    importFileInput.click();
});

// 拖拽事件
importUploadArea.addEventListener('dragover', handleDragOver);
importUploadArea.addEventListener('dragleave', handleDragLeave);
importUploadArea.addEventListener('drop', handleDrop);

// 点击弹窗外部关闭
exportModal.addEventListener('click', (e) => {
    if (e.target === exportModal) {
        closeExport();
    }
});

importModal.addEventListener('click', (e) => {
    if (e.target === importModal) {
        closeImport();
    }
});

// 情绪统计相关DOM元素
const moodStatsModal = document.getElementById('mood-stats-modal');
const moodStatsCloseBtn = document.getElementById('mood-stats-close');
const moodEmojis = ['', '😢', '😟', '😐', '🙂', '😄'];

// 打开情绪统计弹窗
function openMoodStats() {
    calculateMoodStats();
    moodStatsModal.classList.add('active');
}

// 关闭情绪统计弹窗
function closeMoodStats() {
    moodStatsModal.classList.remove('active');
}

// 计算情绪统计数据
function calculateMoodStats() {
    const entries = getAllJournalEntriesWithMood();
    const totalEntries = entries.length;

    // 统计各情绪数量
    const moodCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let totalMood = 0;
    let moodEntriesCount = 0;

    entries.forEach(entry => {
        if (entry.mood) {
            moodCounts[entry.mood]++;
            totalMood += parseInt(entry.mood);
            moodEntriesCount++;
        }
    });

    // 更新总记录数
    document.getElementById('total-entries').textContent = totalEntries;

    // 计算连续记录天数
    const streak = calculateStreak(entries);
    document.getElementById('current-streak').textContent = streak;

    // 计算平均心情
    const avgMood = moodEntriesCount > 0 ? (totalMood / moodEntriesCount).toFixed(1) : '-';
    document.getElementById('avg-mood').textContent = avgMood;

    // 渲染情绪分布条形图
    renderMoodBars(moodCounts, totalEntries);

    // 渲染最近7天趋势
    renderMoodTrend(entries);
}

// 获取所有日记条目（包含情绪）
function getAllJournalEntriesWithMood() {
    const entries = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('journal_')) {
            const dateKey = key.replace('journal_', '');
            const data = JSON.parse(localStorage.getItem(key));
            // 检查是否有实际内容
            const hasContent = data.answers?.some(item => item && item.trim() !== '') ||
                              (Array.isArray(data) && data.some(item => item && item.trim() !== ''));
            if (hasContent || data.mood) {
                entries.push({
                    dateKey: dateKey,
                    date: parseDateKey(dateKey),
                    mood: data.mood,
                    data: data.answers || data
                });
            }
        }
    }
    // 按日期排序
    entries.sort((a, b) => a.date - b.date);
    return entries;
}

// 计算连续记录天数
function calculateStreak(entries) {
    if (entries.length === 0) return 0;

    // 按日期排序（降序）
    const sortedEntries = [...entries].sort((a, b) => b.date - a.date);

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 检查今天或昨天是否有记录
    const lastEntryDate = new Date(sortedEntries[0].date);
    lastEntryDate.setHours(0, 0, 0, 0);

    const diffDays = Math.floor((today - lastEntryDate) / (1000 * 60 * 60 * 24));
    if (diffDays > 1) return 0; // 如果超过1天没记录，连续中断

    // 计算连续天数
    let currentDate = new Date(lastEntryDate);
    for (const entry of sortedEntries) {
        const entryDate = new Date(entry.date);
        entryDate.setHours(0, 0, 0, 0);

        const dayDiff = Math.floor((currentDate - entryDate) / (1000 * 60 * 60 * 24));
        if (dayDiff === 0 || dayDiff === 1) {
            if (dayDiff === 1 || streak === 0) {
                streak++;
                currentDate = entryDate;
            }
        } else {
            break;
        }
    }

    return streak;
}

// 渲染情绪分布条形图
function renderMoodBars(moodCounts, total) {
    const moodBarsContainer = document.getElementById('mood-bars');
    moodBarsContainer.innerHTML = '';

    const moodLabels = ['', '糟糕', '不好', '一般', '不错', '很棒'];

    for (let i = 1; i <= 5; i++) {
        const count = moodCounts[i] || 0;
        const percentage = total > 0 ? (count / total * 100) : 0;

        const barItem = document.createElement('div');
        barItem.className = 'mood-bar-item';
        barItem.innerHTML = `
            <span class="mood-bar-emoji">${moodEmojis[i]}</span>
            <div class="mood-bar-track">
                <div class="mood-bar-fill mood-${i}" style="width: ${percentage}%"></div>
            </div>
            <span class="mood-bar-count">${count}</span>
        `;
        moodBarsContainer.appendChild(barItem);
    }
}

// 渲染最近7天情绪趋势
function renderMoodTrend(entries) {
    const trendChart = document.getElementById('mood-trend-chart');
    trendChart.innerHTML = '';

    // 获取最近7天
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        date.setHours(0, 0, 0, 0);
        last7Days.push(date);
    }

    last7Days.forEach(date => {
        const dateKey = getDateKey(date);
        const entry = entries.find(e => e.dateKey === dateKey);

        const trendItem = document.createElement('div');
        trendItem.className = 'mood-trend-item';

        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        trendItem.innerHTML = `
            <span class="mood-trend-emoji">${entry?.mood ? moodEmojis[entry.mood] : '·'}</span>
            <span class="mood-trend-date">${month}/${day}</span>
        `;

        trendChart.appendChild(trendItem);
    });
}

// 情绪统计事件监听
moodStatsCloseBtn.addEventListener('click', closeMoodStats);

// 点击弹窗外部关闭
moodStatsModal.addEventListener('click', (e) => {
    if (e.target === moodStatsModal) {
        closeMoodStats();
    }
});

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    init();
    initFloatingElements();
});

// ==================== 浮动元素物理动画系统 ====================

class FloatingElement {
    constructor(element, container) {
        this.element = element;
        this.container = container;
        this.rect = element.getBoundingClientRect();
        
        // 随机初始位置（避开中心区域）
        const containerRect = container.getBoundingClientRect();
        const centerX = containerRect.width / 2;
        const centerY = containerRect.height / 2;
        
        // 随机选择象限，避开中心
        let x, y;
        const quadrant = Math.floor(Math.random() * 4);
        switch(quadrant) {
            case 0: // 左上
                x = Math.random() * (centerX - 100);
                y = Math.random() * (centerY - 100);
                break;
            case 1: // 右上
                x = centerX + 100 + Math.random() * (centerX - 100);
                y = Math.random() * (centerY - 100);
                break;
            case 2: // 左下
                x = Math.random() * (centerX - 100);
                y = centerY + 100 + Math.random() * (centerY - 100);
                break;
            case 3: // 右下
                x = centerX + 100 + Math.random() * (centerX - 100);
                y = centerY + 100 + Math.random() * (centerY - 100);
                break;
        }
        
        this.x = x;
        this.y = y;
        
        // 随机速度（1-3像素/帧）
        const speed = 1 + Math.random() * 2;
        const angle = Math.random() * Math.PI * 2;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        
        // 旋转
        this.rotation = Math.random() * 360;
        this.rotationSpeed = (Math.random() - 0.5) * 2;
        
        // 大小变化
        this.scale = 0.8 + Math.random() * 0.4;
        this.scaleSpeed = (Math.random() - 0.5) * 0.01;
        
        // 设置初始位置
        this.updatePosition();
    }
    
    updatePosition() {
        this.element.style.left = this.x + 'px';
        this.element.style.top = this.y + 'px';
        this.element.style.transform = `rotate(${this.rotation}deg) scale(${this.scale})`;
    }
    
    update(containerWidth, containerHeight) {
        // 更新位置
        this.x += this.vx;
        this.y += this.vy;
        
        // 更新旋转
        this.rotation += this.rotationSpeed;
        
        // 更新缩放
        this.scale += this.scaleSpeed;
        if (this.scale > 1.3 || this.scale < 0.7) {
            this.scaleSpeed *= -1;
        }
        
        // 获取元素尺寸
        const width = this.element.offsetWidth;
        const height = this.element.offsetHeight;
        
        // 边界碰撞检测和反弹
        if (this.x <= 0) {
            this.x = 0;
            this.vx = Math.abs(this.vx);
        } else if (this.x + width >= containerWidth) {
            this.x = containerWidth - width;
            this.vx = -Math.abs(this.vx);
        }
        
        if (this.y <= 0) {
            this.y = 0;
            this.vy = Math.abs(this.vy);
        } else if (this.y + height >= containerHeight) {
            this.y = containerHeight - height;
            this.vy = -Math.abs(this.vy);
        }
        
        this.updatePosition();
    }
    
    getCenter() {
        const width = this.element.offsetWidth;
        const height = this.element.offsetHeight;
        return {
            x: this.x + width / 2,
            y: this.y + height / 2
        };
    }
    
    getRadius() {
        return Math.max(this.element.offsetWidth, this.element.offsetHeight) / 2;
    }
    
    // 碰撞后的反弹
    bounce(other) {
        const center1 = this.getCenter();
        const center2 = other.getCenter();
        
        // 碰撞角度
        const dx = center2.x - center1.x;
        const dy = center2.y - center1.y;
        const angle = Math.atan2(dy, dx);
        
        // 交换速度分量（简化弹性碰撞）
        const speed1 = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        const speed2 = Math.sqrt(other.vx * other.vx + other.vy * other.vy);
        
        // 添加一些随机性使运动更自然
        const randomFactor = 0.9 + Math.random() * 0.2;
        
        this.vx = -Math.cos(angle) * speed2 * randomFactor;
        this.vy = -Math.sin(angle) * speed2 * randomFactor;
        other.vx = Math.cos(angle) * speed1 * randomFactor;
        other.vy = Math.sin(angle) * speed1 * randomFactor;
        
        // 分离重叠的元素
        const distance = Math.sqrt(dx * dx + dy * dy);
        const minDistance = this.getRadius() + other.getRadius();
        if (distance < minDistance && distance > 0) {
            const overlap = minDistance - distance;
            const separationX = (dx / distance) * overlap * 0.5;
            const separationY = (dy / distance) * overlap * 0.5;
            
            this.x -= separationX;
            this.y -= separationY;
            other.x += separationX;
            other.y += separationY;
        }
    }
}

// 初始化浮动元素
function initFloatingElements() {
    const container = document.getElementById('floating-container');
    if (!container) return;
    
    const elements = container.querySelectorAll('.floating-item');
    const floatingElements = [];
    
    // 创建浮动元素对象
    elements.forEach(el => {
        floatingElements.push(new FloatingElement(el, container));
    });
    
    // 动画循环
    let lastTime = 0;
    const frameInterval = 1000 / 60; // 60fps
    
    function animate(currentTime) {
        const deltaTime = currentTime - lastTime;
        
        if (deltaTime >= frameInterval) {
            lastTime = currentTime - (deltaTime % frameInterval);
            
            const containerRect = container.getBoundingClientRect();
            const width = containerRect.width;
            const height = containerRect.height;
            
            // 更新所有元素位置
            floatingElements.forEach(el => {
                el.update(width, height);
            });
            
            // 检测元素之间的碰撞
            for (let i = 0; i < floatingElements.length; i++) {
                for (let j = i + 1; j < floatingElements.length; j++) {
                    const el1 = floatingElements[i];
                    const el2 = floatingElements[j];
                    
                    const center1 = el1.getCenter();
                    const center2 = el2.getCenter();
                    const distance = Math.sqrt(
                        Math.pow(center2.x - center1.x, 2) + 
                        Math.pow(center2.y - center1.y, 2)
                    );
                    
                    const minDistance = el1.getRadius() + el2.getRadius();
                    
                    if (distance < minDistance * 0.8) { // 0.8使碰撞更敏感
                        el1.bounce(el2);
                    }
                }
            }
        }
        
        requestAnimationFrame(animate);
    }
    
    requestAnimationFrame(animate);
}
