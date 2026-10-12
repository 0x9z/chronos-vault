/* ============================================
   CHRONOS VAULT - REFERENCE MATRIX
   CIDR/Subnet quick reference table
   ============================================ */

const CheatSheet = {
    data: [
        { cidr: '/32', mask: '255.255.255.255', hosts: '1 (single host)' },
        { cidr: '/31', mask: '255.255.255.254', hosts: '2 (point-to-point)' },
        { cidr: '/30', mask: '255.255.255.252', hosts: '4 (2 usable)' },
        { cidr: '/29', mask: '255.255.255.248', hosts: '8 (6 usable)' },
        { cidr: '/28', mask: '255.255.255.240', hosts: '16 (14 usable)' },
        { cidr: '/27', mask: '255.255.255.224', hosts: '32 (30 usable)' },
        { cidr: '/26', mask: '255.255.255.192', hosts: '64 (62 usable)' },
        { cidr: '/25', mask: '255.255.255.128', hosts: '128 (126 usable)' },
        { cidr: '/24', mask: '255.255.255.0', hosts: '256 (254 usable)' },
        { cidr: '/23', mask: '255.255.254.0', hosts: '512 (510 usable)' },
        { cidr: '/22', mask: '255.255.252.0', hosts: '1,024 (1,022 usable)' },
        { cidr: '/21', mask: '255.255.248.0', hosts: '2,048 (2,046 usable)' },
        { cidr: '/20', mask: '255.255.240.0', hosts: '4,096 (4,094 usable)' },
        { cidr: '/19', mask: '255.255.224.0', hosts: '8,192 (8,190 usable)' },
        { cidr: '/18', mask: '255.255.192.0', hosts: '16,384 (16,382 usable)' },
        { cidr: '/17', mask: '255.255.128.0', hosts: '32,768 (32,766 usable)' },
        { cidr: '/16', mask: '255.255.0.0', hosts: '65,536 (65,534 usable)' },
        { cidr: '/15', mask: '255.254.0.0', hosts: '131,072 (131,070 usable)' },
        { cidr: '/14', mask: '255.252.0.0', hosts: '262,144 (262,142 usable)' },
        { cidr: '/13', mask: '255.248.0.0', hosts: '524,288 (524,286 usable)' },
        { cidr: '/12', mask: '255.240.0.0', hosts: '1,048,576 (1,048,574 usable)' },
        { cidr: '/11', mask: '255.224.0.0', hosts: '2,097,152 (2,097,150 usable)' },
        { cidr: '/10', mask: '255.192.0.0', hosts: '4,194,304 (4,194,302 usable)' },
        { cidr: '/9', mask: '255.128.0.0', hosts: '8,388,608 (8,388,606 usable)' },
        { cidr: '/8', mask: '255.0.0.0', hosts: '16,777,216 (16,777,214 usable)' },
    ],

    init() {
        this.render();
        Storage.logEvent('REFERENCE MATRIX LOADED');
    },

    render() {
        const tbody = document.getElementById('cheatBody');
        if (!tbody) return;

        tbody.innerHTML = this.data.map(row => `
            <tr>
                <td>${row.cidr}</td>
                <td>${row.mask}</td>
                <td>${row.hosts}</td>
            </tr>
        `).join('');
    }
};