// index.js
import './styles.css';
import { addProject, getProjects, saveAll } from './projectManager.js';
import { saveProjects } from './storage.js';

defaultProject().addTodo(
  new Todo('Test saving', 'desc', '2026-11-10', 'low', ''),
);
saveAll();

console.log(getProjects());
