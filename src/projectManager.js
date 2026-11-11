// projectManager.js
import { Project } from './project.js';
import { loadProjects, saveProjects } from './storage.js';
import { isToday, isThisWeek, isFuture, parseISO } from 'date-fns';

let projects = loadProjects();

//Save everything
export function saveAll() {
  saveProjects(projects);
}

//Add project function
export function addProject(name) {
  const newProject = new Project(name);
  projects.push(newProject);
  saveAll(); // save the change before returning
  return newProject;
}

//Read project function
export function getProjects() {
  return projects;
}

//Collect all tasks
export function collectTasks() {
  const tasks = [];
  for (const project of projects) {
    tasks.push(...project.todos);
  }
  return tasks;
}

//Filter today's tasks

export function filterTodayTasks() {
  const todayDates = collectTasks().filter(date =>
    isToday(parseISO(date.dueDate)),
  );
  return todayDates;
}

// Filter week tasks

export function filterWeekTasks() {
  const weekDates = collectTasks().filter(date =>
    isThisWeek(parseISO(date.dueDate), { weekStartsOn: 1 }),
  );
  return weekDates;
}

// FIlter upcoming tasks
export function filterUpcomingTasks() {
  const upcomingDates = collectTasks().filter(todo =>
    isFuture(parseISO(todo.dueDate)),
  );
  return upcomingDates;
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
  saveAll(); // save the change
}

//Delete todo
export function deleteTodo(id) {
  for (const project of projects) {
    if (project.findTodo(id)) {
      project.removeTodo(id);
      saveAll(); // So deletion is saved
      return;
    }
  }
}

//Find project
export function findProject(id) {
  return projects.find(project => project.id === id);
}
