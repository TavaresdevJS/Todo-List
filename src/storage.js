// storage.js
import { getProjects } from './projectManager.js';

export function saveProjects() {
  const projects = getProjects();
  const text = JSON.stringify(projects);
  localStorage.setItem('projects', text);
}

export function loadProjects() {
  const data = JSON.parse(localStorage.getItem('projects')) || [];
  return data;
}
