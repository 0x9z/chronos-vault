/* ============================================
   CHRONOS VAULT - STANDARD CALCULATOR
   Basic arithmetic operations
   ============================================ */

const MathCalc = {
    currentInput: '0',
    previousInput: '',
    operator: null,
    shouldResetDisplay: false,

    init() {
        this.bindEvents();
        Storage.logEvent('STANDARD CALCULATOR ONLINE');
    },

    bindEvents() {
        document.querySelectorAll('.calc-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const action = btn.dataset.action;
                this.handleAction(action);
            });
        });

        // Keyboard support
        document.addEventListener('keydown', (e) => {
            // Only if calc tab is active
            const calcTab = document.getElementById('tab-calc');
            if (!calcTab || !calcTab.classList.contains('active')) return;

            const key = e.key;
            if (key >= '0' && key <= '9') this.handleAction(key);
            if (key === '.') this.handleAction('.');
            if (key === '+') this.handleAction('+');
            if (key === '-') this.handleAction('-');
            if (key === '*') this.handleAction('*');
            if (key === '/') { e.preventDefault(); this.handleAction('/'); }
            if (key === 'Enter' || key === '=') this.handleAction('=');
            if (key === 'Escape') this.handleAction('clear');
            if (key === 'Backspace') this.handleAction('backspace');
            if (key === '%') this.handleAction('percent');
        });
    },

    handleAction(action) {
        // Numbers
        if (action >= '0' && action <= '9') {
            if (this.shouldResetDisplay) {
                this.currentInput = action;
                this.shouldResetDisplay = false;
            } else {
                this.currentInput = this.currentInput === '0' ? action : this.currentInput + action;
            }
            this.updateDisplay();
            return;
        }

        // Decimal
        if (action === '.') {
            if (this.shouldResetDisplay) {
                this.currentInput = '0.';
                this.shouldResetDisplay = false;
            } else if (!this.currentInput.includes('.')) {
                this.currentInput += '.';
            }
            this.updateDisplay();
            return;
        }

        // Operators
        if (['+', '-', '*', '/'].includes(action)) {
            if (this.operator && !this.shouldResetDisplay) {
                this.calculate();
            }
            this.previousInput = this.currentInput;
            this.operator = action;
            this.shouldResetDisplay = true;
            return;
        }

        // Equals
        if (action === '=') {
            this.calculate();
            this.operator = null;
            return;
        }

        // Clear
        if (action === 'clear') {
            this.currentInput = '0';
            this.previousInput = '';
            this.operator = null;
            this.shouldResetDisplay = false;
            this.updateDisplay();
            return;
        }

        // Sign toggle
        if (action === 'sign') {
            if (this.currentInput !== '0') {
                this.currentInput = this.currentInput.startsWith('-')
                    ? this.currentInput.slice(1)
                    : '-' + this.currentInput;
            }
            this.updateDisplay();
            return;
        }

        // Percent
        if (action === 'percent') {
            const num = parseFloat(this.currentInput);
            if (!isNaN(num)) {
                this.currentInput = String(num / 100);
            }
            this.updateDisplay();
            return;
        }

        // Backspace
        if (action === 'backspace') {
            if (this.currentInput.length > 1) {
                this.currentInput = this.currentInput.slice(0, -1);
            } else {
                this.currentInput = '0';
            }
            this.updateDisplay();
            return;
        }
    },

    calculate() {
        const prev = parseFloat(this.previousInput);
        const curr = parseFloat(this.currentInput);

        if (isNaN(prev) || isNaN(curr)) return;

        let result;
        switch (this.operator) {
            case '+': result = prev + curr; break;
            case '-': result = prev - curr; break;
            case '*': result = prev * curr; break;
            case '/':
                if (curr === 0) {
                    this.currentInput = 'ERROR';
                    this.previousInput = '';
                    this.operator = null;
                    this.shouldResetDisplay = true;
                    this.updateDisplay();
                    return;
                }
                result = prev / curr;
                break;
            default: return;
        }

        // Limit precision
        this.currentInput = String(parseFloat(result.toFixed(10)));
        this.previousInput = '';
        this.shouldResetDisplay = true;
        this.updateDisplay();
    },

    updateDisplay() {
        const el = document.getElementById('calcDisplay');
        if (el) {
            el.textContent = this.currentInput;
        }
    }
};