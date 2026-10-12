/* ============================================
   CHRONOS VAULT v2.0 - MAIN ORCHESTRATOR
   Tab navigation + boot sequence
   ============================================ */

(function() {
    'use strict';

    // Tab System
    function initTabs() {
        const tabBtns = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');

        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetId = btn.dataset.tab;

                // Deactivate all
                tabBtns.forEach(b => b.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));

                // Activate target
                btn.classList.add('active');
                const target = document.getElementById(targetId);
                if (target) target.classList.add('active');

                // Save active tab
                Storage.save('cv_active_tab', targetId);
            });
        });

        // Restore last active tab
        const savedTab = Storage.load('cv_active_tab', 'tab-dashboard');
        const savedBtn = document.querySelector(`[data-tab="${savedTab}"]`);
        if (savedBtn) savedBtn.click();
    }

    // Boot sequence
    function bootSequence() {
        const messages = [
            '[BOOT] Chronos Vault v2.0 kernel loading...',
            '[BOOT] Blue Neon Edition initialized...',
            '[BOOT] Tab navigation online...',
            '[BOOT] All modules loaded...',
            '[BOOT] Welcome, survivor.',
        ];

        let delay = 0;
        messages.forEach(msg => {
            setTimeout(() => console.log(msg), delay);
            delay += 120;
        });

        return delay;
    }

    // Initialize everything
    function initAll() {
        const bootDelay = bootSequence();

        setTimeout(() => {
            initTabs();

            // Core
            AudioSystem.init();
            Clock.init();
            Notifications.init();

            // Tools
            MathCalc.init();
            SubnetCalc.init();
            CheatSheet.init();

            // Tasks
            Tasks.init();

            // Timers
            Countdown.init();
            Timer.init();

            // Stats
            Stats.init();
            Stats.incrementSession();

            Storage.logEvent('CHRONOS VAULT v2.0 BOOT COMPLETE');

            console.log('%c☢️ CHRONOS VAULT v2.0 — BLUE NEON EDITION ☢️', 'color: #4a90d9; font-size: 18px;');
            console.log('%cAll systems nominal. Time is ticking.', 'color: #5bb8f0;');
        }, bootDelay + 100);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAll);
    } else {
        initAll();
    }
})();