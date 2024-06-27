

document.addEventListener('DOMContentLoaded', () => {
    loadTasksFromLocalStorage();
});

function loadTasksFromLocalStorage() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || { pending: [], completed: [] };
    const pendingTableBody = document.getElementById('pendingTableBody');
    const completedTableBody = document.getElementById('completedTableBody');

    tasks.pending.forEach((task, index) => {
        addTaskRow(pendingTableBody, task, index + 1);
    });

    tasks.completed.forEach((task, index) => {
        addTaskRow(completedTableBody, task, index + 1, true);
    });
}

function saveTasksToLocalStorage() {
    const pendingTasks = getTasksFromTable(document.getElementById('pendingTableBody'));
    const completedTasks = getTasksFromTable(document.getElementById('completedTableBody'));

    const tasks = { pending: pendingTasks, completed: completedTasks };
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function getTasksFromTable(tableBody) {
    const rows = tableBody.querySelectorAll('tr');
    const tasks = [];

    rows.forEach(row => {
        const todo = row.cells[1].querySelector('input').value;
        const dueDate = row.cells[2].querySelector('input').value;
        const pending = row.cells[3].querySelector('input').checked;
        const completed = row.cells[4].querySelector('input').checked;

        tasks.push({ todo, dueDate, pending, completed });
    });

    return tasks;
}

function addTask() {
    const taskPersonInput = document.getElementById('taskPerson').value;
    const taskDescriptionInput = document.getElementById('taskDescription').value;
    const taskDueDateInput = document.getElementById('taskDueDate').value;

    if (taskPersonInput === '' || taskDescriptionInput === '' || taskDueDateInput === '') {
        alert('Please assign a person, enter a task description, and set a due date');
        return;
    }

    const pendingTableBody = document.getElementById('pendingTableBody');
    const rowCount = pendingTableBody.rows.length;

    const newTask = {
        todo: taskDescriptionInput,
        dueDate: taskDueDateInput,
        pending: true,
        completed: false
    };

    addTaskRow(pendingTableBody, newTask, rowCount + 1);
    saveTasksToLocalStorage();

    document.getElementById('taskPerson').value = '';
    document.getElementById('taskDescription').value = '';
    document.getElementById('taskDueDate').value = '';
}

function addTaskRow(tableBody, task, index, isCompleted = false) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${index}</td>
        <td><input type="text" value="${task.todo}" placeholder=""></td>
        <td><input type="date" value="${task.dueDate}"></td>
        <td class="checkbox-cell"><input type="checkbox" class="pending-checkbox" ${task.pending ? 'checked' : ''}></td>
        <td class="checkbox-cell"><input type="checkbox" class="completed-checkbox" ${task.completed ? 'checked' : ''}></td>
    `;

    tableBody.appendChild(row);

    const pendingCheckbox = row.querySelector('.pending-checkbox');
    const completedCheckbox = row.querySelector('.completed-checkbox');

    pendingCheckbox.addEventListener('change', () => {
        if (pendingCheckbox.checked) {
            completedCheckbox.checked = false;
            moveTask(row, false);
        }
    });

    completedCheckbox.addEventListener('change', () => {
        if (completedCheckbox.checked) {
            pendingCheckbox.checked = false;
            moveTask(row, true);
        }
    });

    if (isCompleted) {
        pendingCheckbox.checked = false;
        completedCheckbox.checked = true;
    }
}

function moveTask(row, toCompleted) {
    const sourceTableBody = row.closest('tbody');
    const targetTableBody = toCompleted ? document.getElementById('completedTableBody') : document.getElementById('pendingTableBody');

    sourceTableBody.removeChild(row);
    targetTableBody.appendChild(row);

    renumberRows(sourceTableBody);
    renumberRows(targetTableBody);

    saveTasksToLocalStorage();
}

function renumberRows(tableBody) {
    const rows = tableBody.querySelectorAll('tr');
    rows.forEach((row, index) => {
        row.cells[0].textContent = index + 1;
    });
}
