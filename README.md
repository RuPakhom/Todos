# ✅ To-Do List App – Development Checklist

---

## 📦 Models

- [x] `Task` class with:
  - [x] Private `#dueDate`
  - [x] Public fields: `title`, `description`, `priority`, `done`, `id`, `projectId`
  - [x] Methods: `toggleDone()`, `get dueDate()`, `set dueDate()`

- [x] `Project` class with:
  - [x] Public fields: `name`, `id`

---

## 💾 StorageManager

- [ ] `saveState()` – Save tasks and projects to `localStorage`
- [ ] `loadState()` – Load and recreate `Task` and `Project` instances
- [ ] `clearAll()` – Clear saved state (optional)

---

## 🧠 Controller (AppController)

- [ ] Store arrays: `tasks[]`, `projects[]`, `currentProjectId`
- [ ] Subscribe to PubSub events:
  - [ ] `task:add`
  - [ ] `task:delete`
  - [ ] `task:toggleDone`
  - [ ] `project:select`
  - [ ] `filter:change`
- [ ] Call model methods on events
- [ ] Call StorageManager to save/load state
- [ ] Publish UI update events:
  - [ ] `tasks:updated`
  - [ ] `projects:updated`
  - [ ] `project:changed`

---

## 🖼️ UI Components

### 🔹 MainUI

- [ ] Initialize all UI submodules
- [ ] Listen to PubSub events and trigger re-renders

### 🔹 ProjectSidebarUI

- [ ] Render all projects
- [ ] Highlight selected project
- [ ] Publish `"project:select"` on click

### 🔹 TaskListUI

- [ ] Render tasks: title, due date, priority color
- [ ] Handle toggle done
- [ ] Handle delete task
- [ ] Expand task to show/edit details (optional)

### 🔹 FiltersUI

- [ ] Render filter buttons (All / Today / Done / Not Done)
- [ ] Publish `"filter:change"` on click

---

## 🔌 PubSub

- [ ] Implement `subscribe(eventName, callback)`
- [ ] Implement `publish(eventName, data)`
- [ ] Used as the communication layer between UI and Controller

---

## 🎬 App Initialization

- [ ] Load state from StorageManager
- [ ] Initialize controller and UI
- [ ] Render initial view
- [ ] Set up all PubSub subscriptions

---

## ✨ Optional Features

- [ ] Form validation (e.g. non-empty title)
- [ ] Priority-based styling (colors/icons)
- [ ] Move tasks between projects
- [ ] Search by task title or description
- [ ] Auto-save on every change