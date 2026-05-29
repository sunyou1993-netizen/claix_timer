document.addEventListener('DOMContentLoaded', () => {
    const timeDisplay = document.getElementById('time-display');
    const minLabel = document.getElementById('min-label');
    const secLabel = document.getElementById('sec-label');
    const progressBar = document.getElementById('progress-bar');
    const startBtn = document.getElementById('start-btn');
    const startLabel = document.getElementById('start-label');
    const startIconContainer = document.getElementById('start-icon-container');
    const resetBtn = document.getElementById('reset-btn');
    const quickBtns = document.querySelectorAll('.quick-btn');
    const mainCard = document.getElementById('main-card');
    const speechBubble = document.getElementById('speech-bubble');
    const charImg = document.getElementById('char-img');

    // UI Adjustment Buttons
    const minMinus = document.getElementById('min-minus');
    const minPlus = document.getElementById('min-plus');
    const secMinus = document.getElementById('sec-minus');
    const secPlus = document.getElementById('sec-plus');

    let duration = 900; // 15 minutes by default
    let timeRemaining = 900;
    let timer = null;
    let isRunning = false;

    const CIRC = 880;

    // Synthesized sound on finish using Web Audio API
    function playChime() {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return;
            const ctx = new AudioContext();
            
            // Bell ringing effect (Double-chime)
            const t = ctx.currentTime;
            
            function ring(pitch, delay) {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);
                
                osc.type = 'sine';
                osc.frequency.setValueAtTime(pitch, t + delay);
                
                // Exponential decay envelope
                gain.gain.setValueAtTime(0.5, t + delay);
                gain.gain.exponentialRampToValueAtTime(0.001, t + delay + 1.2);
                
                osc.start(t + delay);
                osc.stop(t + delay + 1.5);
            }
            
            ring(880, 0);      // A5
            ring(1109.73, 0.15); // C#6
            ring(1318.51, 0.3);  // E6
        } catch (e) {
            console.error('Audio chime failed:', e);
        }
    }

    function update() {
        const m = Math.floor(timeRemaining / 60);
        const s = timeRemaining % 60;
        
        timeDisplay.textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
        
        if (!isRunning) {
            minLabel.textContent = m;
            secLabel.textContent = String(s).padStart(2, '0');
        }

        const pct = timeRemaining / duration;
        const offset = CIRC * (1 - (isNaN(pct) ? 1 : pct));
        progressBar.style.strokeDashoffset = offset;

        if (timeRemaining === 0) {
            mainCard.classList.add('finished');
            stop();
            playChime();
        } else {
            mainCard.classList.remove('finished');
        }
    }

    function toggleTimer() {
        if (isRunning) {
            stop();
        } else {
            start();
        }
    }

    function start() {
        if (isRunning || timeRemaining <= 0) return;
        isRunning = true;
        
        // Update Button UI to STOP mode
        startLabel.textContent = '중지';
        startBtn.classList.add('stop-mode');
        startIconContainer.innerHTML = `
            <svg viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="6" width="12" height="12" rx="2"></rect>
            </svg>
        `;
        
        // Focus Mode UI
        speechBubble.classList.add('focus-mode');
        mainCard.classList.add('focus-mode');
        charImg.classList.add('running');
        speechBubble.innerHTML = '집중하는 당신!!<br>정말 멋져요! ✨';
        
        timer = setInterval(() => {
            timeRemaining--;
            update();
            if (timeRemaining <= 0) {
                stop();
            }
        }, 1000);
    }

    function stop() {
        isRunning = false;
        clearInterval(timer);
        
        // Revert Button UI to START mode
        startLabel.textContent = '시작';
        startBtn.classList.remove('stop-mode');
        startIconContainer.innerHTML = `
            <svg viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
        `;
        
        // Focus Mode Off
        speechBubble.classList.remove('focus-mode');
        mainCard.classList.remove('focus-mode');
        charImg.classList.remove('running');
        speechBubble.innerHTML = '화이팅!!<br>끝까지 집중해요!';
    }

    function reset() {
        stop();
        timeRemaining = duration;
        update();
    }

    // Connect trigger events
    startBtn.onclick = toggleTimer;
    resetBtn.onclick = reset;

    minPlus.onclick = () => {
        if (!isRunning) {
            duration += 60;
            timeRemaining = duration;
            update();
        }
    };

    minMinus.onclick = () => {
        if (!isRunning && duration >= 60) {
            duration -= 60;
            timeRemaining = duration;
            update();
        }
    };

    secPlus.onclick = () => {
        if (!isRunning) {
            duration += 1;
            timeRemaining = duration;
            update();
        }
    };

    secMinus.onclick = () => {
        if (!isRunning && duration > 0) {
            duration -= 1;
            timeRemaining = duration;
            update();
        }
    };

    quickBtns.forEach(button => {
        button.onclick = () => {
            if (isRunning) return;
            quickBtns.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            duration = parseInt(button.dataset.sec);
            timeRemaining = duration;
            update();
        };
    });

    // Run initial rendering
    update();
});
