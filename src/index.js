// index.js
import './styles.css';
import { addProject, getProjects } from './projectManager.js';
import { saveProjects } from './storage.js';

addProject('Groceries');

console.log(getProjects());
saveProjects(getProjects());
