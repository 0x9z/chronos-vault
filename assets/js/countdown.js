/* ============================================
   CHRONOS VAULT - FINAL COUNTDOWN
   Ticks toward a user-defined doomsday
   ============================================ */

const Countdown = {
    targetDate: null,
    intervalId: null,

    init() {
        const saved = Storage.load(Storage.KEYS.COUNTDOWN_TARGET);
        this.targetDate = saved ? new Date(saved) : null;
        this.updateDisplay();
        this.intervalId = setInterval(() => this.updateDisplay(), 1000);
        this.bindEvents();
        Storage.logEvent('COUNTDOWN SYSTEM ACTIVE');
    },

    bindEvents() {
        document.getElementById('btnSetCountdown')?.addEventListener('click', () => this.promptSetDate());
    },

    promptSetDate() {
        const input = prompt(
            'ENTER TARGET DATE AND TIME:\n\nFormat: YYYY-MM-DD HH:MM:SS\nExample: 2026-12-31 23:59:59\n\nLeave empty to clear.',
            this.targetDate ? this._formatDateForInput(this.targetDate) : ''
        );

        if (input === null) return;

        if (input.trim() === '') {
            this.targetDate = null;
            Storage.remove(Storage.KEYS.COUNTDOWN_TARGET);
            Storage.logEvent('COUNTDOWN TARGET CLEARED');
        } else {
            const parsed = new Date(input);
            if (isNaN(parsed.getTime())) {
                alert('INVALID DATE FORMAT. USE: YYYY-MM-DD HH:MM:SS');
                return;
            }
            this.targetDate = parsed;
            Storage.save(Storage.KEYS.COUNTDOWN_TARGET, parsed.toISOString());
            Storage.logEvent('COUNTDOWN TARGET SET');
        }

        this.updateDisplay();
    },

    _formatDateForInput(date) {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        const h = String(date.getHours()).padStart(2, '0');
        const min = String(date.getMinutes()).padStart(2, '0');
        const s = String(date.getSeconds()).padStart(2, '0');
        return `${y}-${m}-${d} ${h}:${min}:${s}`;
    },

    updateDisplay() {
        if (!this.targetDate) {
            this._setText('countdownLabel', 'NO TARGET SET');
            this._setText('countdownTargetFull', 'TARGET: NOT SET');
            ['cdm', 'cdf'].forEach(prefix => {
                this._setText(`${prefix}-days`, '--');
                this._setText(`${prefix}-hours`, '--');
                this._setText(`${prefix}-mins`, '--');
                this._setText(`${prefix}-secs`, '--');
            });
            return;
        }

        const now = new Date();
        let diff = this.targetDate - now;

        if (diff <= 0) {
            this._setText('countdownLabel', '⚠ TARGET REACHED ⚠');
            this._setText('countdownTargetFull', '⚠ TARGET REACHED ⚠');
            ['cdm', 'cdf'].forEach(prefix => {
                this._setText(`${prefix}-days`, '00');
                this._setText(`${prefix}-hours`, '00');
                this._setText(`${prefix}-mins`, '00');
                this._setText(`${prefix}-secs`, '00');
            });
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        diff -= days * 1000 * 60 * 60 * 24;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        diff -= hours * 1000 * 60 * 60;
        const mins = Math.floor(diff / (1000 * 60));
        diff -= mins * 1000 * 60;
        const secs = Math.floor(diff / 1000);

        const dateStr = this._formatDateForInput(this.targetDate);
        this._setText('countdownLabel', `TARGET: ${dateStr}`);
        this._setText('countdownTargetFull', `TARGET: ${dateStr}`);

        // Update both mini (dashboard) and full (tab) displays
        ['cdm', 'cdf'].forEach(prefix => {
            this._setText(`${prefix}-days`, String(days).padStart(2, '0'));
            this._setText(`${prefix}-hours`, String(hours).padStart(2, '0'));
            this._setText(`${prefix}-mins`, String(mins).padStart(2, '0'));
            this._setText(`${prefix}-secs`, String(secs).padStart(2, '0'));
        });
    },

    _setText(id, text) {
        const el = document.getElementById(id);
        if (el) el.textContent = text;
    }
};