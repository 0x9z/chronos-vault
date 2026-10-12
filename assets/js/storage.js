/* ============================================
   CHRONOS VAULT - LOCAL STORAGE ENGINE
   Persists data through the wasteland's chaos
   ============================================ */

const Storage = {
    KEYS: {
        COUNTDOWN_TARGET: 'cv_countdown_target',
        TASKS: 'cv_tasks',
        FOCUS_MINUTES: 'cv_focus_minutes',
        BREAK_MINUTES: 'cv_break_minutes',
        TOTAL_FOCUS_SECONDS: 'cv_total_focus_seconds',
        CYCLES_TODAY: 'cv_cycles_today',
        CYCLES_DATE: 'cv_cycles_date',
        TASKS_DONE: 'cv_tasks_done',
        SESSIONS: 'cv_sessions',
    },

    save(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (e) {
            console.error('[STORAGE] Write failure:', e);
            this.logEvent('STORAGE WRITE FAILED');
            return false;
        }
    },

    load(key, fallback = null) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : fallback;
        } catch (e) {
            console.error('[STORAGE] Read failure:', e);
            this.logEvent('STORAGE READ FAILED');
            return fallback;
        }
    },

    remove(key) {
        localStorage.removeItem(key);
    },

    clearAll() {
        Object.values(this.KEYS).forEach(key => localStorage.removeItem(key));
        this.logEvent('ALL DATA PURGED');
    },

    logEvent(message) {
        const el = document.getElementById('lastEvent');
        if (el) {
            const now = new Date();
            const time = now.toTimeString().slice(0, 8);
            el.textContent = `LAST EVENT [${time}]: ${message}`;
        }
    }
};