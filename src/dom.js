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
} from './projectManager.js';
import { format, parseISO } from 'date-fns'; // Date format API

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
      if (project === currentProject) showProject(defaultProject());
    });
  });
}

export function renderTodo(project) {
  todoList.innerHTML = '';

  project.todos.forEach(todo => {
    const todoItem = document.createElement('li');
    todoItem.classList.add('todo-item');
    todoItem.dataset.id = todo.id;
    if (todo.completed === true) todoItem.classList.toggle('checked');

    const todoText = document.createElement('span');
    todoText.classList.add('todo-text');

    const todoDeleteBtn = document.createElement('button');
    todoDeleteBtn.classList.add('todo-delete-btn');

    const checkBox = document.createElement('input');
    checkBox.type = 'checkbox';
    checkBox.checked = todo.completed;
    checkBox.classList.add('todo-check');

    checkBox.addEventListener('change', () => {
      todo.toggleComplete();
      saveAll();
      renderTodo(project);
    });

    if (todo.dueDate) {
      // Show date only if the task has one
      const date = parseISO(todo.dueDate);
      const formattedDate = format(date, 'MMM d');
      todoText.textContent = `${todo.title} ${formattedDate}`;
    } else {
      todoText.textContent = todo.title;
    }

    todoDeleteBtn.textContent = 'X';

    todoItem.appendChild(checkBox);
    todoList.appendChild(todoItem);
    todoItem.appendChild(todoText);
    todoItem.appendChild(todoDeleteBtn);

    todoDeleteBtn.addEventListener('click', () => {
      project.removeTodo(todo.id); // Deletes todo
      saveAll(); // So deletion is saved
      renderTodo(project); // Redraw the list without the deleted task
    });
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
    todoDescription.value,
    todoDate.value,
    todoPriority.value,
  );
  currentProject.addTodo(todo);
  saveAll();
  renderTodo(currentProject);
  todoToggle();
  todoForm.reset();
});

console.log(collectTasks());
console.log(filterTodayTasks());
