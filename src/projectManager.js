// projectManager.js
import { Project } from './project.js';

const projects = [];

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
