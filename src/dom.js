// dom.js
import { Project } from './project.js';
import {
  addProject,
  getProjects,
  defaultProject,
  findProject,
} from './projectManager.js';

const projectList = document.getElementById('project-list');
const todoList = document.getElementById('todo-list');
const viewTitle = document.getElementById('view-title');
const inboxBtn = document.querySelector('[data-view="inbox"]');
const addProjectBtn = document.getElementById('add-project');
const projectForm = document.getElementById('project-form');
const closeFormBtn = document.getElementById('close-project-btn');
const submitBtn = document.getElementById('submit-project-btn');
const projectNameInput = document.getElementById('name-input');

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

addProjectBtn.addEventListener('click', hiddenToggle);

closeFormBtn.addEventListener('click', hiddenToggle);

projectForm.addEventListener('submit', e => {
  e.preventDefault();

  if (!projectNameInput.value.trim()) {
    alert('Please provide a title');
    return;
  } else {
    addProject(projectNameInput.value);
    renderProject();
    hiddenToggle();
    projectNameInput.value = '';
  }
});
