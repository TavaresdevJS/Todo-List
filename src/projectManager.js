// projectManager.js
import { Project } from './project.js';
import { loadProjects, saveProjects } from './storage.js';
import { isToday, isThisWeek, isFuture, parseISO } from 'date-fns';

// let projects is the app's list of projects in memory, loaded once from localStorage when the page opens.
// Kept private: other files change it only through the functions below.
// `let` because deleteProject replaces it with a filtered array.
let projects = loadProjects();

// Save the whole projects list to localStorage
// Other files call this instead of touching `projects` directly(it's private)
export function saveAll() {
  saveProjects(projects);
}

// Create a new project, add it to the list, save and return it
// (returning it lets the Inbox setup below keep a reference to it)
export function addProject(name) {
  const newProject = new Project(name);
  projects.push(newProject);
  saveAll(); // save the change before returning
  return newProject;
}

// Give other files the list of projects (for reading/looping)
export function getProjects() {
  return projects;
}

// Gather every task from every project into ONE flat array
// The spread (...) pushes each task individually, not the whole todos array
export function collectTasks() {
  const tasks = [];
  for (const project of projects) {
    tasks.push(...project.todos);
  }
  return tasks;
}

// ------FILTERS: each returns an array of tasks from ALL projects---------
// dueDate is a string like '2026-11-14', so parseISO turns into a Date object
// Date object is what isToday needs, so string in, Date out
// (in local time, avoiding the time zone bug of new Date('2026-11-14'))
// Tasls with no date become an Invalid Date, which these checks treat as false.

// collectTasks() returns ONE array with every task from every project.
// filter checks each task (`date` here) and keeps it only if isToday says true.
// todo.dueDate is a string like '2026-11-13', so parseISO turns it into a Date first.
export function filterTodayTasks() {
  const todayDates = collectTasks().filter(date =>
    isToday(parseISO(date.dueDate)),
  );
  return todayDates;
}

// Tasks due this week (Monday to Sunday, including earlier days this week)
export function filterWeekTasks() {
  const weekDates = collectTasks().filter(
    date => isThisWeek(parseISO(date.dueDate), { weekStartsOn: 1 }), // date-fns option 0 = Sunday (default), 1 = monday
  );
  return weekDates;
}

// Tasks due tomorrow or later. parseISO gives midnight at the start of the day,
// so today's midnight has already passed and today's tasks are excluded
export function filterUpcomingTasks() {
  const upcomingDates = collectTasks().filter(todo =>
    isFuture(parseISO(todo.dueDate)),
  );
  return upcomingDates;
}

// Finished tasks (todo.completed is already true/false, so it works as the test)
export function filterCompletedTasks() {
  const completedTasks = collectTasks().filter(todo => todo.completed);
  return completedTasks;
}

// -----Inbox: the default project that already exists-----
let inbox;

if (projects.length === 0) {
  // first visit: nothing was saved, so create the Inbox
  inbox = addProject('Inbox');
} else {
  // returning visit: the Inbox was created first and can never be deleted,
  // so it's always at position 0
  inbox = projects[0];
}

// Give other files the Inbox (used as the fallback view and for new tasks on filter views)
export function defaultProject() {
  return inbox;
}

// Delete project by id.
export function deleteProject(id) {
  if (id === inbox.id) return; // Protects the inbox so it can't be deleted
  projects = projects.filter(project => project.id !== id);
  saveAll(); // save the change
}

// Delete todo/task by id, from whichever project owns it
// Needed for filter views, where tasks from different projects are mixed together
export function deleteTodo(id) {
  for (const project of projects) {
    if (project.findTodo(id)) {
      project.removeTodo(id);
      saveAll(); // So deletion is saved
      return; // a task lives in only one project, so stop once found
    }
  }
}

//Find project by id )returns if none matches)
export function findProject(id) {
  return projects.find(project => project.id === id);
}
