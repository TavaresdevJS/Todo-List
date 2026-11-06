// dom.js
import { Project } from './project.js';
import {
  addProject,
  getProjects,
  defaultProject,
  findProject,
} from './projectManager.js';

// Sidebar
const inboxBtn = document.querySelector('[data-view="inbox"]');
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

export function renderProject() {
  projectList.innerHTML = '';
  getProjects().forEach(project => {
    if (project === defaultProject()) return;
    const projectItem = document.createElement('li');

    projectItem.classList.add('project-item');

    projectItem.textContent = project.name;
    projectItem.dataset.id = project.id;

    projectList.appendChild(projectItem);
  });
}

export function renderTodo(project) {
  todoList.innerHTML = '';

  project.todos.forEach(todo => {
    const todoItem = document.createElement('li');

    todoItem.classList.add('todo-item');

    todoItem.textContent = `${todo.title} ${todo.dueDate}`;
    todoList.appendChild(todoItem);
  });
}

export function showProject(project) {
  currentProject = project;
  renderTodo(project);
  viewTitle.textContent = project.name;
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
    todoDate.value,
    todoPriority.value,
    todoDescription.value,
  );
  currentProject.addTodo(todo);
  renderTodo();
  todoToggle();
  todoNameInput.value = '';
});
