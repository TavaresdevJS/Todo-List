// projectManager.js
import { Project } from './project.js';
import { loadProjects, saveProjects } from './storage.js';

let projects = loadProjects();

//Add project function
export function addProject(name) {
  const newProject = new Project(name);
  projects.push(newProject);
  saveProjects(projects); // save the change before returning
  return newProject;
}

//Read project function
export function getProjects() {
  return projects;
}

//Default project function
let inbox;

if (projects.length === 0) {
  // first visit: nothing was saved, so create the Inbox
  inbox = addProject('Inbox');
} else {
  // returning visit: the saved Inbox is already in the array
  inbox = projects[0];
}
export function defaultProject() {
  return inbox;
}

//Delete project
export function deleteProject(id) {
  if (id === inbox.id) return;
  projects = projects.filter(project => project.id !== id);
  saveProjects(projects); // save the change
}

//Find project
export function findProject(id) {
  return projects.find(project => project.id === id);
}

//Save everything
export function saveAll() {
  saveProjects(projects);
}
