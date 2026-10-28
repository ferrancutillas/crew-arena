(() => {
  "use strict";

  const STORAGE_KEY = "todo-tasks-v1";

  const form = document.getElementById("task-form");
  const input = document.getElementById("task-input");
  const list = document.getElementById("task-list");
  const emptyMessage = document.getElementById("empty-message");
  const countLabel = document.getElementById("task-count");
  const clearDoneBtn = document.getElementById("clear-done");

  /** @type {{id: string, text: string, done: boolean}[]} */
  let tasks = loadTasks();

  function loadTasks() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      console.warn("No se pudieron cargar las tareas:", err);
      return [];
    }
  }

  function saveTasks() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (err) {
      console.warn("No se pudieron guardar las tareas:", err);
    }
  }

  function createId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  }

  function render() {
    list.replaceChildren();

    for (const task of tasks) {
      const li = document.createElement("li");
      li.className = "task-item" + (task.done ? " done" : "");
      li.dataset.id = task.id;

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = task.done;
      checkbox.setAttribute("aria-label", "Marcar como completada: " + task.text);
      checkbox.addEventListener("change", () => toggleTask(task.id));

      const span = document.createElement("span");
      span.className = "task-text";
      span.textContent = task.text;

      const deleteBtn = document.createElement("button");
      deleteBtn.type = "button";
      deleteBtn.className = "delete-btn";
      deleteBtn.textContent = "Eliminar";
      deleteBtn.setAttribute("aria-label", "Eliminar tarea: " + task.text);
      deleteBtn.addEventListener("click", () => deleteTask(task.id));

      li.append(checkbox, span, deleteBtn);
      list.appendChild(li);
    }

    emptyMessage.hidden = tasks.length > 0;

    const pending = tasks.filter((t) => !t.done).length;
    countLabel.textContent = pending === 1 ? "1 pendiente" : pending + " pendientes";
    clearDoneBtn.disabled = tasks.every((t) => !t.done);
  }

  function addTask(text) {
    tasks.push({ id: createId(), text, done: false });
    saveTasks();
    render();
  }

  function toggleTask(id) {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    task.done = !task.done;
    saveTasks();
    render();
  }

  function deleteTask(id) {
    tasks = tasks.filter((t) => t.id !== id);
    saveTasks();
    render();
  }

  function clearDone() {
    tasks = tasks.filter((t) => !t.done);
    saveTasks();
    render();
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    addTask(text);
    input.value = "";
    input.focus();
  });

  clearDoneBtn.addEventListener("click", clearDone);

  render();
})();
