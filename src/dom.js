// dom.js
import { Project } from './project.js';
import { Todo } from './todo.js';
import {
  addProject,
  getProjects,
  defaultProject,
  findProject,
  saveAll,
  deleteProject,
  collectTasks,
  filterTodayTasks,
  deleteTodo,
  filterWeekTasks,
  filterUpcomingTasks,
  filterCompletedTasks,
} from './projectManager.js';
import { format, parseISO } from 'date-fns'; // Date format API

// Sidebar
const inboxBtn = document.querySelector('[data-view="inbox"]');
const todayBtn = document.querySelector('[data-view="today"]');
const weekBtn = document.querySelector('[data-view="week"]');
const upcomingBtn = document.querySelector('[data-view="upcoming"]');
const completedBtn = document.querySelector('[data-view="completed"]');
const projectList = document.getElementById('project-list');
const addProjectBtn = document.getElementById('add-project');

// Project form
const projectForm = document.getElementById('project-form');
const projectNameInput = document.getElementById('name-input');
const closeFormBtn = document.getElementById('close-project-btn');

// Main area
const viewTitle = document.getElementById('view-title');
const todoList = document.getElementById('todo-list');
const addTaskBtn = document.getElementById('add-task');
const todoForm = document.getElementById('todo-form');
const closeTodoBtn = document.getElementById('close-todo-btn');
const todoNameInput = document.getElementById('todo-name-input');
const todoDate = document.getElementById('todo-date-input');
const todoPriority = document.getElementById('todo-priority');
const todoDescription = document.getElementById('todo-description-input');

let currentProject;
let currentView = 'project';

export function renderProject() {
  projectList.innerHTML = '';
  getProjects().forEach(project => {
    if (project === defaultProject()) return;
    const projectItem = document.createElement('li');

    projectItem.classList.add('project-item');
    projectItem.dataset.id = project.id;

    const projectText = document.createElement('span');
    projectText.classList.add('project-text');
    projectText.textContent = project.name;

    const projectDeleteBtn = document.createElement('button');
    projectDeleteBtn.classList.add('project-delete-button');
    projectDeleteBtn.textContent = 'X';

    projectList.appendChild(projectItem);
    projectItem.appendChild(projectText);
    projectItem.appendChild(projectDeleteBtn);

    projectDeleteBtn.addEventListener('click', e => {
      e.stopPropagation();
      deleteProject(project.id);
      renderProject();
      if (currentView !== 'project') {
        // Stay on Today, but don't leave currentProject pointing at a deleted project
        if (project === currentProject) currentProject = defaultProject();
        refreshView(); // re-filter so the deleted project's tasks disappear
      } else if (project === currentProject) {
        showProject(defaultProject());
      }
    });
  });
}

export function renderTodo(todos) {
  todoList.innerHTML = '';

  todos.forEach(todo => {
    const todoItem = document.createElement('li');
    todoItem.classList.add('todo-item');
    todoItem.dataset.id = todo.id;
    if (todo.completed === true) todoItem.classList.toggle('checked');

    const todoText = document.createElement('span');
    todoText.classList.add('todo-text');

    const priority = document.createElement('span');
    priority.classList.add('priority');

    const descriptionText = document.createElement('p');
    descriptionText.classList.add('description-text', 'hidden');

    const descriptionWrapper = document.createElement('div');
    descriptionWrapper.classList.add('description-wrapper', 'hidden');
    descriptionWrapper.appendChild(descriptionText);

    const todoDeleteBtn = document.createElement('button');
    todoDeleteBtn.classList.add('todo-delete-btn');

    const checkBox = document.createElement('input');
    checkBox.type = 'checkbox';
    checkBox.checked = todo.completed;
    checkBox.classList.add('todo-check');

    checkBox.addEventListener('change', () => {
      todo.toggleComplete();
      saveAll();
      refreshView();
    });

    if (todo.dueDate) {
      // Show date only if the task has onee
      const date = parseISO(todo.dueDate);
      const formattedDate = format(date, 'MMM d');
      todoText.textContent = `${todo.title} ${formattedDate}`;
    } else {
      todoText.textContent = todo.title;
    }

    todoDeleteBtn.textContent = 'X';
    priority.textContent = todo.priority;
    descriptionText.textContent = todo.description || 'Add a description...';

    todoItem.appendChild(checkBox);
    todoList.appendChild(todoItem);
    todoItem.appendChild(todoText);
    todoItem.appendChild(priority);
    todoItem.appendChild(todoDeleteBtn);
    todoItem.appendChild(descriptionWrapper);

    todoDeleteBtn.addEventListener('click', () => {
      deleteTodo(todo.id); // Deletes todo
      refreshView(); // Redraw the list without the deleted task
    });

    descriptionText.addEventListener('click', () => {
      const editor = document.createElement('textarea');
      editor.classList.add('description-editor');
      editor.value = todo.description;

      const saveBtn = document.createElement('button');
      saveBtn.classList.add('description-save-btn');
      saveBtn.textContent = 'Save';

      const cancelBtn = document.createElement('button');
      cancelBtn.classList.add('description-cancel-btn');
      cancelBtn.textContent = 'Cancel';

      // Swap the editor out and put the p element back
      const closeEditor = () => {
        descriptionWrapper.replaceChildren(descriptionText);
      };

      saveBtn.addEventListener('click', () => {
        todo.description = editor.value.trim();
        saveAll();
        descriptionText.textContent =
          todo.description || 'Add a description...';
        closeEditor();
      });

      cancelBtn.addEventListener('click', closeEditor);

      // Swap the p element out for the editor
      descriptionWrapper.replaceChildren(editor, saveBtn, cancelBtn);
      editor.focus();
    });
  });
}

export function showProject(project) {
  currentProject = project;
  currentView = 'project';
  renderTodo(project.todos);
  viewTitle.textContent = project.name;
}

export function refreshView() {
  if (currentView === 'today') {
    renderTodo(filterTodayTasks());
  } else if (currentView === 'week') {
    renderTodo(filterWeekTasks());
  } else if (currentView === 'upcoming') {
    renderTodo(filterUpcomingTasks());
  } else if (currentView === 'completed') {
    renderTodo(filterCompletedTasks());
  } else {
    renderTodo(currentProject.todos);
  }
}

projectList.addEventListener('click', e => {
  const li = e.target.closest('li');

  if (!li) return; // Guard clause if click was not inside an <li>
  const projectId = li.dataset.id;
  const projectFound = findProject(projectId);
  showProject(projectFound);
});

inboxBtn.addEventListener('click', () => {
  showProject(defaultProject());
});

todayBtn.addEventListener('click', () => {
  currentView = 'today';
  renderTodo(filterTodayTasks());
  viewTitle.textContent = 'Today';
});

weekBtn.addEventListener('click', () => {
  currentView = 'week';
  renderTodo(filterWeekTasks());
  viewTitle.textContent = 'This Week';
});

upcomingBtn.addEventListener('click', () => {
  currentView = 'upcoming';
  renderTodo(filterUpcomingTasks());
  viewTitle.textContent = 'Upcoming';
});

completedBtn.addEventListener('click', () => {
  currentView = 'completed';
  renderTodo(filterCompletedTasks());
  viewTitle.textContent = 'Completed';
});

function hiddenToggle() {
  projectForm.classList.toggle('hidden');
}

function todoToggle() {
  todoForm.classList.toggle('hidden');
}

addProjectBtn.addEventListener('click', hiddenToggle);

closeFormBtn.addEventListener('click', hiddenToggle);

addTaskBtn.addEventListener('click', todoToggle);

closeTodoBtn.addEventListener('click', todoToggle);

projectForm.addEventListener('submit', e => {
  e.preventDefault();
  const name = projectNameInput.value.trim();

  if (!name.trim()) {
    alert('Please provide a title');
    return;
  }
  addProject(name);
  renderProject();
  hiddenToggle();
  projectNameInput.value = '';
});

todoForm.addEventListener('submit', e => {
  e.preventDefault();
  const name = todoNameInput.value.trim();

  if (!name.trim()) {
    alert('Please provide a task name');
    return;
  }
  const todo = new Todo(
    name,
    todoDescription.value,
    todoDate.value,
    todoPriority.value,
  );

  if (currentView === 'project') {
    currentProject.addTodo(todo);
  } else {
    defaultProject().addTodo(todo);
  }

  saveAll();
  refreshView();

  // Close and reset the form
  todoToggle();
  todoForm.reset();
});

console.log(collectTasks());
console.log(filterTodayTasks());
