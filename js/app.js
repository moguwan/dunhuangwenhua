// 敦煌文化知识测试数据
const quizData = [
    {
        question: "敦煌莫高窟位于中国哪个省份？",
        options: [
            { text: "陕西省", score: 0 },
            { text: "甘肃省", score: 20 },
            { text: "山西省", score: 0 },
            { text: "河南省", score: 0 }
        ],
        correctIndex: 1
    },
    {
        question: "莫高窟始建于哪个朝代？",
        options: [
            { text: "唐朝", score: 0 },
            { text: "隋朝", score: 0 },
            { text: "前秦时期", score: 20 },
            { text: "汉朝", score: 0 }
        ],
        correctIndex: 2
    },
    {
        question: "敦煌壁画中最著名的飞天形象主要描绘的是什么？",
        options: [
            { text: "佛教天神", score: 20 },
            { text: "道教仙人", score: 0 },
            { text: "古代帝王", score: 0 },
            { text: "民间舞者", score: 10 }
        ],
        correctIndex: 0
    },
    {
        question: "《敦煌曲子词》属于哪种文学形式？",
        options: [
            { text: "唐诗", score: 0 },
            { text: "宋词", score: 0 },
            { text: "民间词曲", score: 20 },
            { text: "元曲", score: 0 }
        ],
        correctIndex: 2
    },
    {
        question: "敦煌藏经洞是在哪一年被发现的？",
        options: [
            { text: "1898年", score: 0 },
            { text: "1900年", score: 20 },
            { text: "1910年", score: 0 },
            { text: "1880年", score: 0 }
        ],
        correctIndex: 1
    }
];

// 测试结果等级
const resultLevels = [
    {
        min: 0,
        max: 40,
        title: "初识敦煌",
        desc: "你对敦煌文化还不太了解，建议多关注这座丝路明珠的历史与艺术魅力。"
    },
    {
        min: 41,
        max: 60,
        title: "敦煌学徒",
        desc: "你对敦煌文化已有初步认识，继续探索会有更多惊喜发现。"
    },
    {
        min: 61,
        max: 80,
        title: "丝路行者",
        desc: "你对敦煌文化有较深的了解，仿佛已踏上丝绸之路的旅程。"
    },
    {
        min: 81,
        max: 100,
        title: "莫高大师",
        desc: "你对敦煌文化了如指掌，堪称敦煌文化的传承者与守护者！"
    }
];

// 全局状态
let currentQuestion = 0;
let totalScore = 0;
let isMusicPlaying = false;
let isAnswered = false;

// DOM 元素
const coverPage = document.getElementById('coverPage');
const quizPage = document.getElementById('quizPage');
const resultPage = document.getElementById('resultPage');
const btnStart = document.getElementById('btnStart');
const btnRestart = document.getElementById('btnRestart');
const musicControl = document.getElementById('musicControl');
const progressFill = document.getElementById('progressFill');
const currentNum = document.getElementById('currentNum');
const totalNum = document.getElementById('totalNum');
const questionText = document.getElementById('questionText');
const optionsList = document.getElementById('optionsList');
const feedbackPopup = document.getElementById('feedbackPopup');
const feedbackIcon = document.getElementById('feedbackIcon');
const feedbackText = document.getElementById('feedbackText');
const scoreNum = document.getElementById('scoreNum');
const resultLevel = document.getElementById('resultLevel');
const resultDesc = document.getElementById('resultDesc');
const resultImage = document.getElementById('resultImage');

// 音频元素
const bgMusic = document.getElementById('bgMusic');
const correctSound = document.getElementById('correctSound');
const wrongSound = document.getElementById('wrongSound');
const clickSound = document.getElementById('clickSound');
const completeSound = document.getElementById('completeSound');

// 初始化
function init() {
    totalNum.textContent = quizData.length;
    bindEvents();
    createParticles();
}

// 绑定事件
function bindEvents() {
    btnStart.addEventListener('click', () => {
        playClickSound();
        startQuiz();
    });

    btnRestart.addEventListener('click', () => {
        playClickSound();
        resetQuiz();
    });

    musicControl.addEventListener('click', toggleMusic);
}

// 播放音效
function playClickSound() {
    clickSound.currentTime = 0;
    clickSound.play().catch(() => {});
}

function playCorrectSound() {
    correctSound.currentTime = 0;
    correctSound.play().catch(() => {});
}

function playWrongSound() {
    wrongSound.currentTime = 0;
    wrongSound.play().catch(() => {});
}

function playCompleteSound() {
    completeSound.currentTime = 0;
    completeSound.play().catch(() => {});
}

// 背景音乐控制
function toggleMusic() {
    if (isMusicPlaying) {
        bgMusic.pause();
        musicControl.classList.remove('playing');
        isMusicPlaying = false;
    } else {
        bgMusic.play().catch(() => {
            console.log('音乐播放失败，可能需要用户交互后才能播放');
        });
        musicControl.classList.add('playing');
        isMusicPlaying = true;
    }
}

// 开始测试
function startQuiz() {
    currentQuestion = 0;
    totalScore = 0;
    switchPage(coverPage, quizPage);
    loadQuestion();
    
    // 自动播放背景音乐
    if (!isMusicPlaying) {
        bgMusic.play().then(() => {
            musicControl.classList.add('playing');
            isMusicPlaying = true;
        }).catch(() => {
            console.log('自动播放被阻止，请点击音乐按钮手动播放');
        });
    }
}

// 加载题目
function loadQuestion() {
    isAnswered = false;
    const data = quizData[currentQuestion];
    
    // 更新进度
    const progress = ((currentQuestion + 1) / quizData.length) * 100;
    progressFill.style.width = progress + '%';
    currentNum.textContent = currentQuestion + 1;
    
    // 更新题目
    questionText.textContent = data.question;
    
    // 更新选项
    optionsList.innerHTML = '';
    data.options.forEach((option, index) => {
        const optionItem = document.createElement('div');
        optionItem.className = 'option-item';
        optionItem.innerHTML = `
            <div class="option-content">
                <span class="option-label">${String.fromCharCode(65 + index)}</span>
                <span class="option-text">${option.text}</span>
            </div>
        `;
        optionItem.addEventListener('click', () => selectOption(index));
        optionsList.appendChild(optionItem);
    });
}

// 选择选项
function selectOption(index) {
    if (isAnswered) return;
    isAnswered = true;
    
    const data = quizData[currentQuestion];
    const options = optionsList.querySelectorAll('.option-item');
    const selectedOption = options[index];
    const isCorrect = index === data.correctIndex;
    
    // 禁用所有选项
    options.forEach(opt => opt.classList.add('disabled'));
    
    // 标记正确/错误
    if (isCorrect) {
        selectedOption.classList.add('correct');
        totalScore += data.options[index].score;
        playCorrectSound();
        showFeedback(true);
    } else {
        selectedOption.classList.add('wrong');
        options[data.correctIndex].classList.add('correct');
        playWrongSound();
        showFeedback(false);
    }
    
    // 延迟进入下一题
    setTimeout(() => {
        hideFeedback();
        currentQuestion++;
        
        if (currentQuestion < quizData.length) {
            loadQuestion();
        } else {
            showResult();
        }
    }, 1500);
}

// 显示反馈
function showFeedback(isCorrect) {
    feedbackIcon.textContent = isCorrect ? '✅' : '❌';
    feedbackText.textContent = isCorrect ? '回答正确！' : '回答错误！';
    feedbackText.style.color = isCorrect ? '#4caf50' : '#f44336';
    feedbackPopup.classList.add('show');
}

// 隐藏反馈
function hideFeedback() {
    feedbackPopup.classList.remove('show');
}

// 显示结果
function showResult() {
    playCompleteSound();
    switchPage(quizPage, resultPage);
    
    // 计算最终得分
    const finalScore = totalScore;
    
    // 动画显示分数
    animateScore(finalScore);
    
    // 查找对应等级
    const level = resultLevels.find(l => finalScore >= l.min && finalScore <= l.max);
    
    setTimeout(() => {
        resultLevel.textContent = level.title;
        resultDesc.textContent = level.desc;
        resultImage.textContent = level.title;
    }, 1000);
}

// 分数动画
function animateScore(targetScore) {
    let current = 0;
    const duration = 1500;
    const increment = targetScore / (duration / 16);
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= targetScore) {
            current = targetScore;
            clearInterval(timer);
        }
        scoreNum.textContent = Math.floor(current);
    }, 16);
}

// 重置测试
function resetQuiz() {
    currentQuestion = 0;
    totalScore = 0;
    isAnswered = false;
    
    // 清除所有状态
    progressFill.style.width = '20%';
    scoreNum.textContent = '0';
    resultLevel.textContent = '';
    resultDesc.textContent = '';
    resultImage.textContent = '';
    
    switchPage(resultPage, coverPage);
}

// 页面切换
function switchPage(from, to) {
    from.classList.add('page-leave');
    
    setTimeout(() => {
        from.classList.remove('active', 'page-leave');
        to.classList.add('active', 'page-enter');
        
        setTimeout(() => {
            to.classList.remove('page-enter');
        }, 500);
    }, 400);
}

// 创建粒子效果
function createParticles() {
    const container = document.querySelector('.app-container');
    
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 3 + 's';
        particle.style.animationDuration = (3 + Math.random() * 2) + 's';
        container.appendChild(particle);
    }
}

// 启动应用
document.addEventListener('DOMContentLoaded', init);
