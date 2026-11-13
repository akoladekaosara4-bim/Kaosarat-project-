document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".navigation");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    nav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
      nav.classList.remove("open"); toggle.setAttribute("aria-expanded", "false");
    }));
  }

  // Academic planner: add, complete, delete, filter and retain tasks in this browser.
  const form = document.getElementById("taskForm");
  if (form) {
    const input = document.getElementById("taskInput");
    const list = document.getElementById("taskList");
    const count = document.getElementById("taskCount");
    const filterButtons = [...document.querySelectorAll(".filter")];
    const key = "akolade-academic-planner-v2";
    let tasks = [];
    try { tasks = JSON.parse(localStorage.getItem(key) || "[]"); } catch { tasks = []; }
    let filter = "all";
    const save = () => localStorage.setItem(key, JSON.stringify(tasks));
    function render() {
      list.replaceChildren();
      count.textContent = `${tasks.length} ${tasks.length === 1 ? "task" : "tasks"}`;
      const visible = tasks.filter(t => filter === "all" || (filter === "active" ? !t.done : t.done));
      if (!visible.length) {
        const empty = document.createElement("li"); empty.className = "empty";
        empty.textContent = tasks.length ? "No tasks in this filter." : "Add your first academic task to get started.";
        list.append(empty); return;
      }
      visible.forEach(task => {
        const li = document.createElement("li"); li.className = `task-item${task.done ? " done" : ""}`;
        const check = document.createElement("input"); check.type = "checkbox"; check.className = "task-check";
        check.checked = task.done; check.setAttribute("aria-label", "Mark task complete");
        check.addEventListener("change", () => { task.done = check.checked; save(); render(); });
        const text = document.createElement("span"); text.className = "task-text"; text.textContent = task.text;
        const del = document.createElement("button"); del.type = "button"; del.className = "delete-task";
        del.textContent = "×"; del.setAttribute("aria-label", "Delete task");
        del.addEventListener("click", () => { tasks = tasks.filter(t => t.id !== task.id); save(); render(); });
        li.append(check, text, del); list.append(li);
      });
    }
    form.addEventListener("submit", e => {
      e.preventDefault(); const text = input.value.trim(); if (!text) return;
      tasks.unshift({ id: Date.now() + Math.random(), text, done: false });
      save(); input.value = ""; render(); input.focus();
    });
    filterButtons.forEach(btn => btn.addEventListener("click", () => {
      filter = btn.dataset.filter;
      filterButtons.forEach(b => b.classList.toggle("active", b === btn)); render();
    }));
    render();
  }

  const contact = document.getElementById("contactForm");
  if (contact) contact.addEventListener("submit", e => {
    e.preventDefault();
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();
    const subject = encodeURIComponent(`Portfolio enquiry from ${name}`);
    const body = encodeURIComponent(`${message}\\n\\nFrom: ${name}\\nEmail: ${email}`);
    document.getElementById("formFeedback").textContent = "Opening your email application with a prepared draft…";
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  });
});