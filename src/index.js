// index.js
import './styles.css';
import {
  getProjects,
  addProject,
  defaultProject,
  saveAll,
} from './projectManager.js';
import { renderProject } from './dom.js';

console.log(getProjects());
addProject('Groceries');
addProject('Gym');
renderProject();
