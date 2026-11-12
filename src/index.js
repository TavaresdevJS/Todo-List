// index.js
import './styles.css';
import { defaultProject } from './projectManager.js';
import { renderProject, showProject } from './dom.js';

renderProject();
showProject(defaultProject());
