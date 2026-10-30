// storage.js
import { Todo } from './todo.js';
import { Project } from './project.js';

export function saveProjects(projects) {
  const text = JSON.stringify(projects);
  localStorage.setItem('projects', text);
}

export function loadProjects() {
  let data;
  try {
    data = JSON.parse(localStorage.getItem('projects')) || [];
  } catch {
    data = [];
  }
  return data.map(projectData => {
    const rebuilt = new Project(projectData.name);
    rebuilt.id = projectData.id;
    rebuilt.todos = projectData.todos.map(todoData => {
      const todo = new Todo(
        todoData.title,
        todoData.description,
        todoData.dueDate,
        todoData.priority,
        todoData.notes,
      );
      todo.id = todoData.id;
      todo.completed = todoData.completed;
      return todo;
    });

    return rebuilt;
  });
}
