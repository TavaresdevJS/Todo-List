// dom.js
import { Project } from './project.js';
import { addProject, getProjects, defaultProject } from './projectManager.js';

const projectList = document.getElementById('project-list');

export function renderProject() {
  projectList.innerHTML = '';
  getProjects().forEach(project => {
    if (project === defaultProject()) return;
    const projectItem = document.createElement('li');

    projectItem.classList.add('project-item');

    projectItem.textContent = project.name;
    projectList.appendChild(projectItem);
  });
}
