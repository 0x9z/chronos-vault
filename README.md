# Chronos Vault — Network Survival Dashboard

![img](topology.png)

A browser-based productivity dashboard built for network engineers and IT students. Everything runs offline — no server, no tracking.

**Live Demo:** [zero.ma/chronos-vault/](https://zero.ma/chronos-vault/)

---

## Features

- **Pomodoro Timer** — focus + break cycles with audio notifications
- **Subnet Calculator** — with full CIDR reference
- **Standard Calculator** — basic math operations
- **Task Manager** — "Mission Log" with persistence
- **Live Clock** — real-time display
- **Countdown Timer** — custom intervals

---

## Architecture

```
chronos-vault/
├── index.html
└── assets/
    ├── css/
    │   └── style.css
    └── js/
        ├── storage.js
        ├── audio.js
        ├── clock.js
        ├── countdown.js
        ├── timer.js
        ├── mathCalc.js
        ├── subnetCalc.js
        ├── tasks.js
        ├── cheatSheet.js
        ├── notifications.js
        ├── stats.js
        └── main.js
```

**Modular JavaScript.** Each feature has its own file.

---

## Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript (no frameworks)
- LocalStorage for persistence
- Browser Notifications API
- Web Audio API

---

## Why

Network engineers spend hours in terminals. This dashboard puts the essential tools in one place:
- Focus timer for study sessions
- Subnet calculator for quick math
- Task manager for tracking work
- CIDR reference for exam prep

---

## Live Demo

[zero.ma/chronos-vault/](https://zero.ma/chronos-vault/)

---

## Notes

Built as a productivity experiment with AI assistance.

---

## License

MIT — free to use for learning and personal projects.

## by Anas Ait Baani - @0x9z
