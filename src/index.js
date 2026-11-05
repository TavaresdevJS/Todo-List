// index.js
import './styles.css';
import { Todo } from './todo.js';
import {
  getProjects,
  addProject,
  defaultProject,
  saveAll,
} from './projectManager.js';
import { renderProject, renderTodo, showProject } from './dom.js';

console.log(getProjects());

//testing
/* const groceries = addProject('Groceries');
groceries.addTodo(new Todo('Buy eggs', '', '2026-11-06', 'medium'));

const gym = addProject('Gym');
gym.addTodo(
  new Todo('Leg day', 'Squats and deadlifts', '2026-11-05', 'high')
);

saveAll(); */

renderProject();
showProject(defaultProject());
