// Режим калькулятора
const num1Input = document.getElementById('num1');
const num2Input = document.getElementById('num2');
const operationSelect = document.getElementById('operation');
const calculateBtn = document.getElementById('calculateBtn');
const resultDiv = document.getElementById('result');
const errorDiv = document.getElementById('error');

// Переключение режимов
const calcModeBtn = document.getElementById('calcModeBtn');
const gameModeBtn = document.getElementById('gameModeBtn');
const calculatorMode = document.getElementById('calculatorMode');
const gameMode = document.getElementById('gameMode');

calcModeBtn.addEventListener('click', () => {
    calcModeBtn.classList.add('active');
    gameModeBtn.classList.remove('active');
    calculatorMode.style.display = 'block';
    gameMode.style.display = 'none';
});

gameModeBtn.addEventListener('click', () => {
    gameModeBtn.classList.add('active');
    calcModeBtn.classList.remove('active');
    gameMode.style.display = 'block';
    calculatorMode.style.display = 'none';
});

/* ---------- Достижения ---------- */
const achievementsBtn = document.getElementById('achievementsBtn');
const achievementsModal = document.getElementById('achievementsModal');
const closeAchievements = document.getElementById('closeAchievements');
const achievementsList = document.getElementById('achievementsList');
const achOpened = document.getElementById('achOpened');
const achTotal = document.getElementById('achTotal');
const achBadge = document.getElementById('achBadge');
const toastArea = document.getElementById('toastArea');

const ACHIEVEMENTS = [
    {
        id: 'millionaire',
        icon: '💰',
        title: 'Миллионик',
        desc: 'Введи 1 000 000 в любое поле калькулятора'
    },
    {
        id: 'einstein',
        icon: '🧠',
        title: 'Альберт Эйнштейн',
        desc: 'Реши 10 примеров правильно за одну игру',
        goal: 10,
        stat: 'bestGameCorrect'
    },
    {
        id: 'first_calc',
        icon: '🧮',
        title: 'Первый шаг',
        desc: 'Выполни своё первое вычисление'
    },
    {
        id: 'all_ops',
        icon: '🔀',
        title: 'Универсал',
        desc: 'Используй все четыре операции: +, −, ×, ÷',
        goal: 4,
        stat: 'opsUsed'
    },
    {
        id: 'div_zero',
        icon: '🚫',
        title: 'На ноль делить нельзя',
        desc: 'Попробуй разделить число на ноль'
    },
    {
        id: 'negative',
        icon: '📉',
        title: 'Минус на минус',
        desc: 'Получи отрицательный результат'
    },
    {
        id: 'big_result',
        icon: '💎',
        title: 'Крупная сумма',
        desc: 'Получи результат от 1 000 000'
    },
    {
        id: 'streak5',
        icon: '🎯',
        title: 'Без промаха',
        desc: 'Дай 5 правильных ответов подряд в игре',
        goal: 5,
        stat: 'bestStreak'
    },
    {
        id: 'sniper',
        icon: '🏹',
        title: 'Снайпер',
        desc: 'Закончи игру со 100% точностью (минимум 5 ответов)'
    },
    {
        id: 'marathon',
        icon: '🏃',
        title: 'Марафонец',
        desc: 'Реши 50 примеров правильно за всё время',
        goal: 50,
        stat: 'totalCorrect'
    }
];

const ACH_KEY = 'calculatorAchievementsV1';

function defaultAchState() {
    return {
        unlocked: {},
        totalCorrect: 0,
        bestGameCorrect: 0,
        bestStreak: 0,
        bestAccuracy: 0,
        opsUsed: []
    };
}

function loadAchState() {
    try {
        const raw = localStorage.getItem(ACH_KEY);
        if (!raw) return defaultAchState();
        const parsed = JSON.parse(raw);
        return {
            ...defaultAchState(),
            ...parsed,
            unlocked: parsed.unlocked || {},
            opsUsed: Array.isArray(parsed.opsUsed) ? parsed.opsUsed : []
        };
    } catch (e) {
        return defaultAchState();
    }
}

function saveAchState() {
    try {
        localStorage.setItem(ACH_KEY, JSON.stringify(achState));
    } catch (e) {
        // localStorage может быть недоступен — игра продолжит работать
    }
}

let achState = loadAchState();

function achProgress(a) {
    if (!a.goal) return null;
    let current;
    if (a.stat === 'opsUsed') {
        current = achState.opsUsed.length;
    } else {
        current = achState[a.stat] || 0;
    }
    return {
        current: Math.min(current, a.goal),
        goal: a.goal
    };
}

function renderAchievements() {
    const unlockedCount = ACHIEVEMENTS.filter(a => achState.unlocked[a.id]).length;

    achOpened.textContent = unlockedCount;
    achTotal.textContent = ACHIEVEMENTS.length;
    achBadge.textContent = `${unlockedCount}/${ACHIEVEMENTS.length}`;

    achievementsList.innerHTML = '';

    ACHIEVEMENTS.forEach(a => {
        const unlocked = !!achState.unlocked[a.id];
        const card = document.createElement('div');
        card.className = `achievement-card ${unlocked ? 'unlocked' : 'locked'}`;

        let progressHtml = '';
        const progress = achProgress(a);
        if (progress) {
            const percent = Math.round((progress.current / progress.goal) * 100);
            progressHtml = `
                <div class="ach-progress"><div class="ach-progress-fill" style="width: ${percent}%"></div></div>
                <div class="ach-progress-label">${progress.current} / ${progress.goal}</div>
            `;
        }

        card.innerHTML = `
            <div class="achievement-icon">${unlocked ? a.icon : '🔒'}</div>
            <div class="achievement-body">
                <div class="achievement-title">
                    ${a.title}
                    <span class="achievement-status">${unlocked ? 'Получено' : 'Не получено'}</span>
                </div>
                <div class="achievement-desc">${a.desc}</div>
                ${progressHtml}
            </div>
        `;

        achievementsList.appendChild(card);
    });
}

function showAchievementToast(a) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
        <div class="toast-icon">${a.icon}</div>
        <div class="toast-text">
            <span class="toast-label">ДОСТИЖЕНИЕ ПОЛУЧЕНО</span>
            <span>${a.title}</span>
        </div>
    `;
    toastArea.appendChild(toast);

    setTimeout(() => toast.remove(), 3800);
}

function unlockAchievement(id) {
    if (achState.unlocked[id]) return false;

    const a = ACHIEVEMENTS.find(item => item.id === id);
    if (!a) return false;

    achState.unlocked[id] = true;
    saveAchState();
    renderAchievements();
    showAchievementToast(a);
    return true;
}

achievementsBtn.addEventListener('click', () => {
    renderAchievements();
    achievementsModal.style.display = 'flex';
});

closeAchievements.addEventListener('click', () => {
    achievementsModal.style.display = 'none';
});

achievementsModal.addEventListener('click', (e) => {
    if (e.target === achievementsModal) {
        achievementsModal.style.display = 'none';
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && achievementsModal.style.display === 'flex') {
        achievementsModal.style.display = 'none';
    }
});

function checkMillionValue(input) {
    if (Number(input.value) === 1000000) {
        unlockAchievement('millionaire');
    }
}

num1Input.addEventListener('input', () => checkMillionValue(num1Input));
num2Input.addEventListener('input', () => checkMillionValue(num2Input));

renderAchievements();

function calculate() {
    errorDiv.style.display = 'none';
    errorDiv.textContent = '';
    
    const num1 = parseFloat(num1Input.value);
    const num2 = parseFloat(num2Input.value);
    const operation = operationSelect.value;
    
    if (isNaN(num1) || isNaN(num2)) {
        errorDiv.textContent = 'Пожалуйста, введите оба числа';
        errorDiv.style.display = 'block';
        resultDiv.textContent = '-';
        return;
    }
    
    let result;
    
    switch (operation) {
        case '+':
            result = num1 + num2;
            break;
        case '-':
            result = num1 - num2;
            break;
        case '*':
            result = num1 * num2;
            break;
        case '/':
            if (num2 === 0) {
                errorDiv.textContent = 'Деление на ноль невозможно';
                errorDiv.style.display = 'block';
                resultDiv.textContent = '-';
                unlockAchievement('div_zero');
                return;
            }
            result = num1 / num2;
            break;
        default:
            errorDiv.textContent = 'Неизвестная операция';
            errorDiv.style.display = 'block';
            resultDiv.textContent = '-';
            return;
    }
    
    if (result % 1 !== 0) {
        result = Math.round(result * 1000000) / 1000000;
    }

    resultDiv.textContent = result;

    // Достижения калькулятора
    if (!achState.opsUsed.includes(operation)) {
        achState.opsUsed.push(operation);
        saveAchState();
    }

    unlockAchievement('first_calc');

    if (achState.opsUsed.length === 4) {
        unlockAchievement('all_ops');
    }

    if (result < 0) {
        unlockAchievement('negative');
    }

    if (Math.abs(result) >= 1000000) {
        unlockAchievement('big_result');
    }
}

calculateBtn.addEventListener('click', calculate);

num1Input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        calculate();
    }
});

num2Input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        calculate();
    }
});

// Режим игры
const gameTimeEl = document.getElementById('gameTime');
const gameScoreEl = document.getElementById('gameScore');
const gameStartScreen = document.getElementById('gameStartScreen');
const gamePlayScreen = document.getElementById('gamePlayScreen');
const gameEndScreen = document.getElementById('gameEndScreen');
const startGameBtn = document.getElementById('startGameBtn');
const restartGameBtn = document.getElementById('restartGameBtn');
const numAEl = document.getElementById('numA');
const numBEl = document.getElementById('numB');
const opSymbolEl = document.getElementById('opSymbol');
const answerInput = document.getElementById('answerInput');
const checkAnswerBtn = document.getElementById('checkAnswerBtn');
const feedbackEl = document.getElementById('feedback');
const finalGameScoreEl = document.getElementById('finalGameScore');
const finalGameAccuracyEl = document.getElementById('finalGameAccuracy');

let gameTimeLeft = 25;
let gameScore = 0;
let currentAnswer = 0;
let gameTimerInterval;
let currentNumA, currentNumB, currentOp;
let gameCorrect = 0;
let gameAnswered = 0;
let gameStreak = 0;
let answerLocked = false;

function generateExample() {
    const operations = ['+', '-', '*'];
    currentOp = operations[Math.floor(Math.random() * operations.length)];
    
    if (currentOp === '+') {
        currentNumA = Math.floor(Math.random() * 50) + 1;
        currentNumB = Math.floor(Math.random() * 50) + 1;
        currentAnswer = currentNumA + currentNumB;
        opSymbolEl.textContent = '+';
    } else if (currentOp === '-') {
        currentNumA = Math.floor(Math.random() * 50) + 20;
        currentNumB = Math.floor(Math.random() * 20) + 1;
        currentAnswer = currentNumA - currentNumB;
        opSymbolEl.textContent = '-';
    } else if (currentOp === '*') {
        currentNumA = Math.floor(Math.random() * 12) + 2;
        currentNumB = Math.floor(Math.random() * 12) + 2;
        currentAnswer = currentNumA * currentNumB;
        opSymbolEl.textContent = '×';
    }
    
    numAEl.textContent = currentNumA;
    numBEl.textContent = currentNumB;
    answerInput.value = '';
    answerLocked = false;
    feedbackEl.textContent = '';
    feedbackEl.className = 'feedback';
    answerInput.focus();
}

function startMathGame() {
    gameTimeLeft = 25;
    gameScore = 0;
    gameCorrect = 0;
    gameAnswered = 0;
    gameStreak = 0;
    answerLocked = false;
    gameScoreEl.textContent = gameScore;
    gameTimeEl.textContent = gameTimeLeft;

    gameStartScreen.style.display = 'none';
    gameEndScreen.style.display = 'none';
    gamePlayScreen.style.display = 'block';

    generateExample();

    clearInterval(gameTimerInterval);
    gameTimerInterval = setInterval(() => {
        gameTimeLeft--;
        gameTimeEl.textContent = gameTimeLeft;
        if (gameTimeLeft <= 0) {
            endMathGame();
        }
    }, 1000);
}

function checkAnswer() {
    if (answerLocked) return;

    const userAnswer = parseFloat(answerInput.value);

    if (isNaN(userAnswer)) {
        feedbackEl.textContent = 'Введите число!';
        feedbackEl.className = 'feedback wrong';
        return;
    }

    answerLocked = true;
    gameAnswered++;

    if (Math.abs(userAnswer - currentAnswer) < 0.0001) {
        gameScore++;
        gameCorrect++;
        gameStreak++;
        gameScoreEl.textContent = gameScore;
        feedbackEl.textContent = 'Правильно! +1';
        feedbackEl.className = 'feedback correct';

        // Статистика достижений
        achState.totalCorrect++;
        if (gameCorrect > achState.bestGameCorrect) {
            achState.bestGameCorrect = gameCorrect;
        }
        if (gameStreak > achState.bestStreak) {
            achState.bestStreak = gameStreak;
        }
        saveAchState();

        if (gameCorrect >= 10) unlockAchievement('einstein');
        if (gameStreak >= 5) unlockAchievement('streak5');
        if (achState.totalCorrect >= 50) unlockAchievement('marathon');

        setTimeout(generateExample, 500);
    } else {
        gameStreak = 0;
        saveAchState();
        feedbackEl.textContent = `Неправильно. Ответ: ${currentAnswer}`;
        feedbackEl.className = 'feedback wrong';
        setTimeout(generateExample, 1000);
    }
}

function endMathGame() {
    clearInterval(gameTimerInterval);
    gamePlayScreen.style.display = 'none';
    gameEndScreen.style.display = 'block';
    finalGameScoreEl.textContent = gameScore;

    const accuracy = gameAnswered > 0 ? Math.round((gameCorrect / gameAnswered) * 100) : 0;
    finalGameAccuracyEl.textContent = accuracy;

    if (accuracy > (achState.bestAccuracy || 0)) {
        achState.bestAccuracy = accuracy;
        saveAchState();
    }

    if (gameAnswered >= 5 && accuracy === 100) {
        unlockAchievement('sniper');
    }
}

startGameBtn.addEventListener('click', startMathGame);
restartGameBtn.addEventListener('click', startMathGame);
checkAnswerBtn.addEventListener('click', checkAnswer);

answerInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        checkAnswer();
    }
});
