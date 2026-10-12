/* ============================================
   CHRONOS VAULT - AUDIO SYSTEM
   Generates alarm sounds from the void
   ============================================ */

const AudioSystem = {
    audioCtx: null,

    init() {
        try {
            this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.warn('[AUDIO] Web Audio API unavailable');
        }
    },

    playAlarm(type = 'klaxon') {
        if (!this.audioCtx) {
            this.init();
            if (!this.audioCtx) return;
        }

        if (this.audioCtx.state === 'suspended') {
            this.audioCtx.resume();
        }

        switch (type) {
            case 'klaxon':
                this._klaxon();
                break;
            case 'beep':
                this._beep();
                break;
            case 'ping':
                this._ping();
                break;
            default:
                this._beep();
        }
    },

    _klaxon() {
        const ctx = this.audioCtx;
        const now = ctx.currentTime;

        for (let i = 0; i < 6; i++) {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'square';
            osc.frequency.setValueAtTime(800, now + i * 0.3);
            osc.frequency.setValueAtTime(600, now + i * 0.3 + 0.15);

            gain.gain.setValueAtTime(0.12, now);
            gain.gain.linearRampToValueAtTime(0, now + i * 0.3 + 0.3);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(now + i * 0.3);
            osc.stop(now + i * 0.3 + 0.3);
        }
    },

    _beep() {
        const ctx = this.audioCtx;
        const now = ctx.currentTime;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.value = 1000;
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.3);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.3);
    },

    _ping() {
        const ctx = this.audioCtx;
        const now = ctx.currentTime;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.value = 2000;
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.1);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.1);
    }
};