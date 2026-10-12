/* ============================================
   CHRONOS VAULT - SYSTEM CLOCK
   Dual display: header mini + dashboard large
   ============================================ */

const Clock = {
    intervalId: null,

    init() {
        this.update();
        this.intervalId = setInterval(() => this.update(), 1000);
        Storage.logEvent('SYSTEM CLOCK SYNCHRONIZED');
    },

    update() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const timeStr = `${hours}:${minutes}:${seconds}`;

        const dateStr = now.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        // Header clock
        const headerClock = document.getElementById('liveClock');
        const headerDate = document.getElementById('liveDate');
        if (headerClock) headerClock.textContent = timeStr;
        if (headerDate) headerDate.textContent = dateStr.toUpperCase();

        // Dashboard large clock
        const largeClock = document.getElementById('clockDisplayLarge');
        const largeDate = document.getElementById('dateDisplayLarge');
        if (largeClock) largeClock.textContent = timeStr;
        if (largeDate) largeDate.textContent = dateStr.toUpperCase();
    }
};