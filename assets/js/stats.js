/* ============================================
   CHRONOS VAULT - SURVIVOR STATS TRACKER
   Dashboard mini + detailed tab displays
   ============================================ */

const Stats = {
    init() {
        this.refresh();
        document.getElementById('btnResetStats')?.addEventListener('click', () => {
            if (confirm('WIPE ALL SURVIVAL DATA? THIS CANNOT BE UNDONE.')) {
                Storage.clearAll();
                this.refresh();
                if (typeof Tasks !== 'undefined') {
                    Tasks.tasks = [];
                    Tasks.render();
                }
                if (typeof Timer !== 'undefined') {
                    Timer.cyclesCompleted = 0;
                    Timer.updateDisplay();
                }
                if (typeof Countdown !== 'undefined') {
                    Countdown.targetDate = null;
                    Countdown.updateDisplay();
                }
                Storage.logEvent('ALL DATA WIPED - FRESH START');
            }
        });
        Storage.logEvent('STATS TRACKER ONLINE');
    },

    refresh() {
        const totalSecs = Storage.load(Storage.KEYS.TOTAL_FOCUS_SECONDS, 0);
        const hours = Math.floor(totalSecs / 3600);
        const mins = Math.floor((totalSecs % 3600) / 60);
        const cycles = Storage.load(Storage.KEYS.CYCLES_TODAY, 0);
        const tasksDone = Storage.load(Storage.KEYS.TASKS_DONE, 0);
        const sessions = Storage.load(Storage.KEYS.SESSIONS, 0);

        // Dashboard mini
        const focusMini = document.getElementById('statFocus');
        const cyclesMini = document.getElementById('statCycles');
        const tasksMini = document.getElementById('statTasks');
        if (focusMini) focusMini.textContent = `${hours}h ${mins}m`;
        if (cyclesMini) cyclesMini.textContent = cycles;
        if (tasksMini) tasksMini.textContent = tasksDone;

        // Detailed tab
        const focusFull = document.getElementById('statTotalFocus');
        const cyclesFull = document.getElementById('statCyclesToday');
        const tasksFull = document.getElementById('statTasksDone');
        const sessionsFull = document.getElementById('statSessions');
        if (focusFull) focusFull.textContent = `${hours}h ${mins}m`;
        if (cyclesFull) cyclesFull.textContent = cycles;
        if (tasksFull) tasksFull.textContent = tasksDone;
        if (sessionsFull) sessionsFull.textContent = sessions;
    },

    incrementSession() {
        const sessions = Storage.load(Storage.KEYS.SESSIONS, 0);
        Storage.save(Storage.KEYS.SESSIONS, sessions + 1);
        this.refresh();
    }
};