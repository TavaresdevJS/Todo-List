// index.js
import './styles.css';
import { Todo } from './todo.js';
import {
  getProjects,
  addProject,
  defaultProject,
  saveAll,
} from './projectManager.js';
import { renderProject, renderTodo } from './dom.js';

console.log(getProjects());

defaultProject().addTodo(
  new Todo('Buy milk', 'Whole milk', '2026-11-05', 'high', ''),
);
defaultProject().addTodo(new Todo('Call mom', '', '2026-11-07', 'low', ''));
saveAll();

renderProject();
renderTodo(defaultProject());
