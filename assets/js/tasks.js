/* ============================================
   CHRONOS VAULT - MISSION LOG
   Editable task list with persistence
   ============================================ */

const Tasks = {
    tasks: [],

    init() {
        this.tasks = Storage.load(Storage.KEYS.TASKS, []);
        this.render();
        this.bindEvents();
        Storage.logEvent('MISSION LOG LOADED');
    },

    bindEvents() {
        document.getElementById('btnAddTask')?.addEventListener('click', () => this.addTask());
        document.getElementById('taskInput')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTask();
        });
        document.getElementById('btnClearDone')?.addEventListener('click', () => this.clearCompleted());
    },

    addTask() {
        const input = document.getElementById('taskInput');
        const text = input?.value.trim();
        if (!text) return;

        this.tasks.push({
            id: Date.now(),
            text: text,
            completed: false,
            created: new Date().toISOString()
        });

        input.value = '';
        this.save();
        this.render();
        Storage.logEvent(`TASK ADDED: ${text.slice(0, 30)}`);
    },

    toggleTask(id) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            if (task.completed) {
                const done = Storage.load(Storage.KEYS.TASKS_DONE, 0);
                Storage.save(Storage.KEYS.TASKS_DONE, done + 1);
                if (typeof Stats !== 'undefined') Stats.refresh();
            }
            this.save();
            this.render();
            AudioSystem.playAlarm('ping');
        }
    },

    deleteTask(id) {
        this.tasks = this.tasks.filter(t => t.id !== id);
        this.save();
        this.render();
        Storage.logEvent('TASK DELETED');
    },

    clearCompleted() {
        this.tasks = this.tasks.filter(t => !t.completed);
        this.save();
        this.render();
        Storage.logEvent('COMPLETED TASKS PURGED');
    },

    save() {
        Storage.save(Storage.KEYS.TASKS, this.tasks);
        this.updateCount();
    },

    render() {
        const list = document.getElementById('taskList');
        if (!list) return;

        list.innerHTML = '';

        if (this.tasks.length === 0) {
            const li = document.createElement('li');
            li.style.color = 'var(--text-dim)';
            li.style.fontStyle = 'italic';
            li.style.justifyContent = 'center';
            li.style.padding = '20px';
            li.textContent = 'NO ACTIVE OBJECTIVES...';
            list.appendChild(li);
        } else {
            this.tasks.forEach(task => {
                const li = document.createElement('li');
                if (task.completed) li.classList.add('completed');

                const checkbox = document.createElement('span');
                checkbox.className = 'task-checkbox' + (task.completed ? ' checked' : '');
                checkbox.textContent = task.completed ? '✓' : '';
                checkbox.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.toggleTask(task.id);
                });

                const text = document.createElement('span');
                text.className = 'task-text';
                text.textContent = task.text;

                const del = document.createElement('button');
                del.className = 'task-delete';
                del.textContent = '✕';
                del.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.deleteTask(task.id);
                });

                li.appendChild(checkbox);
                li.appendChild(text);
                li.appendChild(del);
                list.appendChild(li);
            });
        }

        this.updateCount();
    },

    updateCount() {
        const badge = document.getElementById('taskCount');
        const pending = this.tasks.filter(t => !t.completed).length;
        if (badge) badge.textContent = pending;
    }
};