/* ============================================
   CHRONOS VAULT - FOCUS PROTOCOL TIMER
   Pomodoro-style with dual display
   ============================================ */

const Timer = {
    totalSeconds: 25 * 60,
    remainingSeconds: 25 * 60,
    intervalId: null,
    isRunning: false,
    isFocusPhase: true,
    cyclesCompleted: 0,
    focusMinutes: 25,
    breakMinutes: 5,

    init() {
        this.focusMinutes = Storage.load(Storage.KEYS.FOCUS_MINUTES, 25);
        this.breakMinutes = Storage.load(Storage.KEYS.BREAK_MINUTES, 5);
        this.totalSeconds = this.focusMinutes * 60;
        this.remainingSeconds = this.totalSeconds;

        const today = new Date().toDateString();
        const savedDate = Storage.load(Storage.KEYS.CYCLES_DATE);
        if (savedDate === today) {
            this.cyclesCompleted = Storage.load(Storage.KEYS.CYCLES_TODAY, 0);
        } else {
            this.cyclesCompleted = 0;
            Storage.save(Storage.KEYS.CYCLES_DATE, today);
            Storage.save(Storage.KEYS.CYCLES_TODAY, 0);
        }

        this.updateDisplay();
        this.bindEvents();
        Storage.logEvent('FOCUS PROTOCOL INITIALIZED');
    },

    bindEvents() {
        // Full timer buttons
        document.getElementById('btnTimerStart')?.addEventListener('click', () => this.start());
        document.getElementById('btnTimerPause')?.addEventListener('click', () => this.pause());
        document.getElementById('btnTimerReset')?.addEventListener('click', () => this.reset());

        // Mini timer buttons
        document.getElementById('btnTimerMiniStart')?.addEventListener('click', () => this.start());
        document.getElementById('btnTimerMiniPause')?.addEventListener('click', () => this.pause());
        document.getElementById('btnTimerMiniReset')?.addEventListener('click', () => this.reset());

        document.getElementById('focusMinutes')?.addEventListener('change', (e) => {
            this.focusMinutes = parseInt(e.target.value) || 25;
            Storage.save(Storage.KEYS.FOCUS_MINUTES, this.focusMinutes);
            if (!this.isRunning) {
                this.totalSeconds = this.focusMinutes * 60;
                this.remainingSeconds = this.totalSeconds;
                this.updateDisplay();
            }
        });
        document.getElementById('breakMinutes')?.addEventListener('change', (e) => {
            this.breakMinutes = parseInt(e.target.value) || 5;
            Storage.save(Storage.KEYS.BREAK_MINUTES, this.breakMinutes);
        });
    },

    start() {
        if (this.isRunning) return;
        AudioSystem.init();
        this.isRunning = true;
        this._updateButtonStates();
        this._updateBadge();
        this.intervalId = setInterval(() => this.tick(), 1000);
    },

    pause() {
        this.isRunning = false;
        clearInterval(this.intervalId);
        this._updateButtonStates();
    },

    reset() {
        this.pause();
        this.isFocusPhase = true;
        this.totalSeconds = this.focusMinutes * 60;
        this.remainingSeconds = this.totalSeconds;
        this._updateBadge();
        this.updateDisplay();
    },

    tick() {
        this.remainingSeconds--;
        if (this.remainingSeconds <= 0) {
            this._phaseComplete();
        }
        this.updateDisplay();
    },

    _phaseComplete() {
        clearInterval(this.intervalId);
        this.isRunning = false;

        if (this.isFocusPhase) {
            this.cyclesCompleted++;
            Storage.save(Storage.KEYS.CYCLES_TODAY, this.cyclesCompleted);

            const total = Storage.load(Storage.KEYS.TOTAL_FOCUS_SECONDS, 0);
            Storage.save(Storage.KEYS.TOTAL_FOCUS_SECONDS, total + (this.focusMinutes * 60));

            if (typeof Stats !== 'undefined') Stats.refresh();
            if (typeof Notifications !== 'undefined') {
                Notifications.show(
                    'FOCUS PHASE COMPLETE',
                    `Cycle ${this.cyclesCompleted} finished. Take a ${this.breakMinutes}-minute break.`
                );
            }
            AudioSystem.playAlarm('klaxon');

            this.isFocusPhase = false;
            this.totalSeconds = this.breakMinutes * 60;
            this.remainingSeconds = this.totalSeconds;
            this._updateBadge();
            this._updateButtonStates();
            this.updateDisplay();

            setTimeout(() => this.start(), 500);
        } else {
            if (typeof Notifications !== 'undefined') {
                Notifications.show('BREAK OVER', 'Time to focus again. The wasteland waits for no one.');
            }
            AudioSystem.playAlarm('ping');

            this.isFocusPhase = true;
            this.totalSeconds = this.focusMinutes * 60;
            this.remainingSeconds = this.totalSeconds;
            this._updateBadge();
        }

        this._updateButtonStates();
        this.updateDisplay();
    },

    _updateBadge() {
        const badge = document.getElementById('timerPhaseBadge');
        const miniStatus = document.getElementById('timerMini');

        if (badge) {
            if (!this.isRunning && this.isFocusPhase && this.remainingSeconds === this.totalSeconds) {
                badge.textContent = 'IDLE';
            } else {
                badge.textContent = this.isFocusPhase ? 'FOCUS' : 'BREAK';
            }
        }

        if (miniStatus) {
            if (this.isRunning) {
                miniStatus.textContent = this.isFocusPhase ? '⏲ FOCUS' : '⏲ BREAK';
                miniStatus.className = this.isFocusPhase ? 'status online' : 'status warning';
            } else {
                miniStatus.textContent = '⏲ IDLE';
                miniStatus.className = 'status idle';
            }
        }
    },

    updateDisplay() {
        const mins = Math.floor(this.remainingSeconds / 60);
        const secs = this.remainingSeconds % 60;
        const timeStr = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

        // Full timer
        const fullEl = document.getElementById('timerFull');
        if (fullEl) {
            fullEl.textContent = timeStr;
            if (this.remainingSeconds <= 60 && this.isRunning) {
                fullEl.style.color = 'var(--text-danger)';
            } else if (!this.isFocusPhase && this.isRunning) {
                fullEl.style.color = 'var(--text-warning)';
            } else {
                fullEl.style.color = '';
            }
        }

        // Mini timer
        const miniEl = document.getElementById('timerMiniDisplay');
        if (miniEl) miniEl.textContent = timeStr;

        // Cycles
        const cyclesEl = document.getElementById('timerCycles');
        if (cyclesEl) cyclesEl.textContent = `CYCLES COMPLETED: ${this.cyclesCompleted}`;
    },

    _updateButtonStates() {
        const startBtns = [document.getElementById('btnTimerStart'), document.getElementById('btnTimerMiniStart')];
        const pauseBtns = [document.getElementById('btnTimerPause'), document.getElementById('btnTimerMiniPause')];

        startBtns.forEach(b => { if (b) b.disabled = this.isRunning; });
        pauseBtns.forEach(b => { if (b) b.disabled = !this.isRunning; });
    }
};