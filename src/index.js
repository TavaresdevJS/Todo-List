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

renderProject();
showProject(defaultProject());
