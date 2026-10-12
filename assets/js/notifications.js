/* ============================================
   CHRONOS VAULT - NOTIFICATION SYSTEM
   Visual overlays and browser alerts
   ============================================ */

const Notifications = {
    isVisible: false,
    permissionGranted: false,

    init() {
        if ('Notification' in window) {
            if (Notification.permission === 'granted') {
                this.permissionGranted = true;
            } else if (Notification.permission !== 'denied') {
                Notification.requestPermission().then(perm => {
                    this.permissionGranted = perm === 'granted';
                });
            }
        }

        document.getElementById('notificationDismiss')?.addEventListener('click', () => this.dismiss());
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isVisible) this.dismiss();
        });

        Storage.logEvent('NOTIFICATION SYSTEM ACTIVE');
    },

    show(title, message) {
        const overlay = document.getElementById('notificationOverlay');
        const titleEl = document.getElementById('notificationTitle');
        const msgEl = document.getElementById('notificationMessage');

        if (overlay && titleEl && msgEl) {
            titleEl.textContent = title;
            msgEl.textContent = message;
            overlay.classList.remove('hidden');
            this.isVisible = true;
            clearTimeout(this._dismissTimeout);
            this._dismissTimeout = setTimeout(() => this.dismiss(), 8000);
        }

        if (this.permissionGranted) {
            try {
                new Notification(title, { body: message });
            } catch (e) {
                console.warn('[NOTIFY] Browser notification failed:', e);
            }
        }

        const sysStatus = document.getElementById('sysStatus');
        if (sysStatus) {
            sysStatus.className = 'status critical';
            sysStatus.textContent = '● SYS ALERT';
            setTimeout(() => {
                sysStatus.className = 'status online';
                sysStatus.textContent = '● SYS NOMINAL';
            }, 5000);
        }

        Storage.logEvent(`ALERT: ${title}`);
    },

    dismiss() {
        const overlay = document.getElementById('notificationOverlay');
        if (overlay) overlay.classList.add('hidden');
        this.isVisible = false;
        clearTimeout(this._dismissTimeout);
    }
};