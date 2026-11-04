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

projectList.addEventListener('click', e => {
  const li = e.target.closest('li');

  if (!li) return; // Guard clause if click was not inside an <li>
  const projectId = li.dataset.id;
  const projectFound = findProject(projectId);
  renderTodo(projectFound);
  viewTitle.textContent = projectFound.name;
});
