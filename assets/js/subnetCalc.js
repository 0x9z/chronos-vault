/* ============================================
   CHRONOS VAULT - SUBNET CALCULATOR
   IP, subnet mask, CIDR, binary calculations
   ============================================ */

const SubnetCalc = {
    init() {
        this.bindEvents();
        Storage.logEvent('SUBNET CALCULATOR ONLINE');
    },

    bindEvents() {
        document.getElementById('btnSubnetCalc')?.addEventListener('click', () => this.calculate());
        document.getElementById('subnetIP')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.calculate();
        });
        document.getElementById('subnetMask')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.calculate();
        });
    },

    calculate() {
        const ipInput = document.getElementById('subnetIP')?.value.trim();
        const maskInput = document.getElementById('subnetMask')?.value.trim();

        if (!ipInput) { this._showError('ENTER IP ADDRESS'); return; }
        if (!maskInput) { this._showError('ENTER SUBNET MASK'); return; }

        const ipOctets = this._parseIP(ipInput);
        if (!ipOctets) { this._showError('INVALID IP ADDRESS'); return; }

        let maskOctets, cidr;
        if (maskInput.startsWith('/')) {
            cidr = parseInt(maskInput.slice(1));
            if (isNaN(cidr) || cidr < 0 || cidr > 32) {
                this._showError('INVALID CIDR: USE /0 - /32');
                return;
            }
            maskOctets = this._cidrToMask(cidr);
        } else {
            maskOctets = this._parseIP(maskInput);
            if (!maskOctets) { this._showError('INVALID SUBNET MASK'); return; }
            cidr = this._maskToCIDR(maskOctets);
            if (cidr === -1) { this._showError('INVALID SUBNET MASK FORMAT'); return; }
        }

        const networkOctets = ipOctets.map((o, i) => o & maskOctets[i]);
        const broadcastOctets = ipOctets.map((o, i) => (o & maskOctets[i]) | (255 - maskOctets[i]));
        const totalHosts = Math.pow(2, 32 - cidr);
        const usableHosts = totalHosts > 2 ? totalHosts - 2 : (totalHosts === 2 ? 0 : 1);
        const firstHost = [...networkOctets];
        firstHost[3] = totalHosts > 2 ? firstHost[3] + 1 : firstHost[3];
        const lastHost = [...broadcastOctets];
        lastHost[3] = totalHosts > 2 ? lastHost[3] - 1 : lastHost[3];
        const binaryMask = maskOctets.map(o => String(o).padStart(3, '0')).join('.');

        this._setResult('resNetwork', networkOctets.join('.'));
        this._setResult('resBroadcast', broadcastOctets.join('.'));
        this._setResult('resRange', `${firstHost.join('.')} - ${lastHost.join('.')}`);
        this._setResult('resHosts', `${usableHosts} usable / ${totalHosts} total`);
        this._setResult('resCIDR', `/${cidr} = ${maskOctets.join('.')}`);
        this._setResult('resBinary', binaryMask);

        Storage.logEvent(`SUBNET CALCULATED: ${ipInput} /${cidr}`);
    },

    _parseIP(ip) {
        const parts = ip.split('.');
        if (parts.length !== 4) return null;
        const octets = parts.map(p => parseInt(p));
        if (octets.some(o => isNaN(o) || o < 0 || o > 255)) return null;
        return octets;
    },

    _cidrToMask(cidr) {
        const mask = [];
        for (let i = 0; i < 4; i++) {
            const bits = Math.min(8, Math.max(0, cidr - i * 8));
            mask.push(256 - Math.pow(2, 8 - bits));
        }
        return mask;
    },

    _maskToCIDR(mask) {
        let cidr = 0;
        for (const octet of mask) {
            if (octet === 255) cidr += 8;
            else if (octet === 254) cidr += 7;
            else if (octet === 252) cidr += 6;
            else if (octet === 248) cidr += 5;
            else if (octet === 240) cidr += 4;
            else if (octet === 224) cidr += 3;
            else if (octet === 192) cidr += 2;
            else if (octet === 128) cidr += 1;
            else if (octet === 0) { /* done */ }
            else return -1;
        }
        return cidr;
    },

    _showError(msg) {
        ['resNetwork', 'resBroadcast', 'resRange', 'resHosts', 'resCIDR', 'resBinary'].forEach(id => {
            this._setResult(id, '--');
        });
        this._setResult('resNetwork', msg);
    },

    _setResult(id, value) {
        const el = document.getElementById(id);
        if (el) el.textContent = value;
    }
};