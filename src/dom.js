// dom.js
import { Project } from './project.js';
import { addProject, getProjects, defaultProject } from './projectManager.js';

const projectList = document.getElementById('project-list');
const todoList = document.getElementById('todo-list');

export function renderProject() {
  projectList.innerHTML = '';
  getProjects().forEach(project => {
    if (project === defaultProject()) return;
    const projectItem = document.createElement('li');

    projectItem.classList.add('project-item');

    projectItem.textContent = project.name;
    projectList.appendChild(projectItem);
  });
}

export function renderTodo(project) {
  todoList.innerHTML = '';

  project.todos.forEach(todo => {
    const todoItem = document.createElement('li');

    todoItem.classList.add('todo-item');

    todoItem.textContent = todo.title;
    todoList.appendChild(todoItem);
  });
}
