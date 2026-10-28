// projectManager.js
import { Project } from './project.js';

let projects = [];

//Add project function
export function addProject(name) {
  const newProject = new Project(name);
  projects.push(newProject);
  return newProject;
}

//Read project function
export function getProjects() {
  return projects;
}

//Default project function
const inbox = addProject('Inbox');

export function defaultProject() {
  return inbox;
}

//Delete project
export function deleteProject(id) {
  if (id === inbox.id) return;
  projects = projects.filter(project => project.id !== id);
}

//Find project
export function findProject(id) {
  return projects.find(project => project.id === id);
}
