const taskInput = document.getElementById("taskInput");
const dateInput = document.getElementById("dateInput"); // Récupérer l'input date
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");

addBtn.addEventListener("click", function() {
    const text = taskInput.value.trim();
    const dueDate = dateInput.value; // Récupère la date (ex: "2024-05-20")
    
    if (text === "") return;

    createTaskElement(text, false, dueDate);
    saveTasks();
    taskInput.value = "";
    dateInput.value = "";
});

function createTaskElement(text, isCompleted, dueDate) {
    const li = document.createElement("li");
    if (isCompleted) li.classList.add("completed");

    // --- LOGIQUE DE RETARD ---
    const today = new Date().toISOString().split('T')[0]; // Date d'aujourd'hui format YYYY-MM-DD
    if (dueDate && dueDate < today && !isCompleted) {
        li.classList.add("overdue");
    }

    li.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
            <input type="checkbox" class="check" ${isCompleted ? 'checked' : ''}>
            <div>
                <span>${text}</span>
                <div class="task-date">${dueDate ? '📅 ' + dueDate : ''}</div>
            </div>
        </div>
        <button class="delete-btn">🗑</button>
    `;

    // Événement Checkbox (on retire le style "overdue" si coché)
    li.querySelector(".check").addEventListener("change", function() {
        li.classList.toggle("completed");
        if(li.classList.contains("completed")) {
            li.classList.remove("overdue");
        } else if (dueDate && dueDate < today) {
            li.classList.add("overdue");
        }
        saveTasks();
    });

    li.querySelector(".delete-btn").addEventListener("click", () => { 
        li.remove(); 
        saveTasks(); 
    });

    taskList.appendChild(li);
}

// Mise à jour de saveTasks pour inclure la date
function saveTasks() {
    const tasks = [];
    document.querySelectorAll("#taskList li").forEach(li => {
        tasks.push({
            text: li.querySelector("span").innerText,
            completed: li.classList.contains("completed"),
            date: li.querySelector(".task-date").innerText.replace('📅 ', '')
        });
    });
    localStorage.setItem("myTasks", JSON.stringify(tasks));
}

// Mise à jour de loadTasks
function loadTasks() {
    const savedTasks = JSON.parse(localStorage.getItem("myTasks")) || [];
    savedTasks.forEach(task => {
        createTaskElement(task.text, task.completed, task.date);
    });
}

document.addEventListener("DOMContentLoaded", loadTasks);


taskInput.addEventListener("keydown", function(e) {
    if (e.key === "Enter") {
        addBtn.click();
    }
});