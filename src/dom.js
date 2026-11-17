// dom.js
// Everything that touches the page lives here: drawing projects and tasks,
// and wiring up the sidebar, buttons and forms.
// The data itself (projects, todos, localStorage) is handled in projectManager.js,
// so this file reads from it and asks it to make changes, then redraws.
import { Todo } from './todo.js';
import {
  addProject,
  getProjects,
  defaultProject,
  findProject,
  saveAll,
  deleteProject,
  filterTodayTasks,
  deleteTodo,
  filterWeekTasks,
  filterUpcomingTasks,
  filterCompletedTasks,
} from './projectManager.js';
import { format, parseISO } from 'date-fns';

// ==== DOM references (looked up once, reused everywhere) ====

// Sidebar
const themeBtn = document.getElementById('theme-toggle');
const sidebar = document.querySelector('nav');
const inboxBtn = document.querySelector('[data-view="inbox"]');
const todayBtn = document.querySelector('[data-view="today"]');
const weekBtn = document.querySelector('[data-view="week"]');
const upcomingBtn = document.querySelector('[data-view="upcoming"]');
const completedBtn = document.querySelector('[data-view="completed"]');
const projectList = document.getElementById('project-list');
const addProjectBtn = document.getElementById('add-project');

// Project form
const projectForm = document.getElementById('project-form');
const projectNameInput = document.getElementById('name-input');
const closeFormBtn = document.getElementById('close-project-btn');

// Main area
const mainArea = document.querySelector('main');
const viewTitle = document.getElementById('view-title');
const todoList = document.getElementById('todo-list');
const addTaskBtn = document.getElementById('add-task');
const todoForm = document.getElementById('todo-form');
const closeTodoBtn = document.getElementById('close-todo-btn');
const todoNameInput = document.getElementById('todo-name-input');
const todoDate = document.getElementById('todo-date-input');
const todoPriority = document.getElementById('todo-priority');
const todoDescription = document.getElementById('todo-description-input');

// ==== App state ====

// What's on screen right now.
// currentView is 'project' when a project (or the Inbox) is open,
// otherwise the name of a filter view. The filter names match the
// data-view attributes in the HTML, so updateSelected() can find the button.
let currentProject;
let currentView = 'project';

// ==== Sidebar: draw the project list ====

// Theme change btn
themeBtn.addEventListener('click', () => {
  sidebar.classList.toggle('light');
  mainArea.classList.toggle('light');
});

// Rebuild the sidebar project list from the data
export function renderProject() {
  projectList.innerHTML = ''; // clear old rows before redrawing
  getProjects().forEach(project => {
    if (project === defaultProject()) return; // Inbox has its own button, skip it here
    const projectItem = document.createElement('li');

    projectItem.classList.add('project-item');
    projectItem.dataset.id = project.id; // lets the <ul> click listener know which project was clicked

    // Name in its own span, so it sits beside the X without wiping it
    const projectText = document.createElement('span');
    projectText.classList.add('project-text');
    projectText.textContent = project.name;

    const projectDeleteBtn = document.createElement('button');
    projectDeleteBtn.classList.add('project-delete-button');
    projectDeleteBtn.textContent = 'X';

    projectList.appendChild(projectItem);
    projectItem.appendChild(projectText);
    projectItem.appendChild(projectDeleteBtn);

    projectDeleteBtn.addEventListener('click', e => {
      e.stopPropagation(); // don't let the click bubble up and "open" the project we're deleting
      deleteProject(project.id);
      renderProject();
      if (currentView !== 'project') {
        // On a filter view: stay there, but don't leave currentProject pointing at a deleted project
        if (project === currentProject) currentProject = defaultProject();
        refreshView(); // re-filter so the deleted project's tasks disappear
      } else if (project === currentProject) {
        showProject(defaultProject()); // the open project is gone, fall back to the Inbox
      }
    });
  });

  // The rows were just rebuilt, so re-apply the highlight
  updateSelected();
}

// ==== Main area: draw the task list ====

// Rebuild the task list for whatever todos are passed in.
// Listeners are attached per task inside the loop, so each one can use
// `todo` directly (closure) instead of looking the task up by id later.
export function renderTodo(todos) {
  todoList.innerHTML = '';

  todos.forEach(todo => {
    const todoItem = document.createElement('li');
    todoItem.classList.add('todo-item');
    todoItem.dataset.id = todo.id;
    if (todo.completed === true) todoItem.classList.toggle('checked'); // strikes through the title in CSS

    const todoText = document.createElement('span');
    todoText.classList.add('todo-text');

    const priority = document.createElement('span');
    priority.classList.add('priority');
    if (todo.priority) priority.classList.add(`priority-${todo.priority}`); // e.g. priority-high, CSS colours the pill

    const descriptionText = document.createElement('p');
    descriptionText.classList.add('description-text');

    // Description starts collapsed, clicking the title toggles it
    const descriptionWrapper = document.createElement('div');
    descriptionWrapper.classList.add('description-wrapper', 'hidden');
    descriptionWrapper.appendChild(descriptionText);

    const todoDeleteBtn = document.createElement('button');
    todoDeleteBtn.classList.add('todo-delete-btn');

    const checkBox = document.createElement('input');
    checkBox.type = 'checkbox';
    checkBox.checked = todo.completed;
    checkBox.classList.add('todo-check');

    // Redraw instead of only toggling the class, so a task that no longer
    // belongs in the current view (e.g. completed while on "Today") disappears
    checkBox.addEventListener('change', () => {
      todo.toggleComplete();
      saveAll();
      refreshView();
    });

    // The date input gives a 'YYYY-MM-DD' string. parseISO turns it into a Date
    // so date-fns can format it as 'Nov 16'. Tasks without a date show only the title.
    if (todo.dueDate) {
      const date = parseISO(todo.dueDate);
      const formattedDate = format(date, 'MMM d');
      todoText.textContent = `${todo.title} ${formattedDate}`;
    } else {
      todoText.textContent = todo.title;
    }

    todoDeleteBtn.textContent = 'X';
    priority.textContent = todo.priority;
    descriptionText.textContent = todo.description || 'Add a description...';

    todoItem.appendChild(checkBox);
    todoList.appendChild(todoItem);
    todoItem.appendChild(todoText);
    todoItem.appendChild(priority);
    todoItem.appendChild(todoDeleteBtn);
    todoItem.appendChild(descriptionWrapper);

    // Change the data first, then redraw the list from it
    todoDeleteBtn.addEventListener('click', () => {
      deleteTodo(todo.id);
      refreshView();
    });

    todoText.addEventListener('click', () => {
      descriptionWrapper.classList.toggle('hidden');
    });

    // Inline editing: swap the <p> for a textarea + Save/Cancel, then swap back.
    // The editor is only created when needed, not for every task up front.
    descriptionText.addEventListener('click', () => {
      const editor = document.createElement('textarea');
      editor.classList.add('description-editor');
      editor.value = todo.description;

      const saveBtn = document.createElement('button');
      saveBtn.classList.add('description-save-btn');
      saveBtn.textContent = 'Save';

      const cancelBtn = document.createElement('button');
      cancelBtn.classList.add('description-cancel-btn');
      cancelBtn.textContent = 'Cancel';

      const closeEditor = () => {
        descriptionWrapper.replaceChildren(descriptionText);
      };

      // Update the text in place instead of calling refreshView(),
      // otherwise the whole list redraws and the description collapses again
      saveBtn.addEventListener('click', () => {
        todo.description = editor.value.trim();
        saveAll();
        descriptionText.textContent =
          todo.description || 'Add a description...';
        closeEditor();
      });

      cancelBtn.addEventListener('click', closeEditor);

      descriptionWrapper.replaceChildren(editor, saveBtn, cancelBtn);
      editor.focus();
    });
  });
}

// ==== Switching views ====

// Open a project. The Inbox is the default project, so it goes through here too.
export function showProject(project) {
  currentProject = project;
  currentView = 'project';
  renderTodo(project.todos);
  viewTitle.textContent = project.name;
  updateSelected();
}

// Highlight whatever is open in the sidebar: a view button or a project row.
// Called whenever the view changes or the project list is rebuilt.
function updateSelected() {
  // Remove the highlight from everything
  document
    .querySelectorAll('.nav .selected')
    .forEach(el => el.classList.remove('selected'));

  // Add it to the one thing that is open right now
  let selectedEl;
  if (currentView !== 'project') {
    selectedEl = document.querySelector(`[data-view="${currentView}"]`);
  } else if (currentProject === defaultProject()) {
    selectedEl = inboxBtn; // The default project is shown as "Inbox"
  } else if (currentProject) {
    selectedEl = projectList.querySelector(`[data-id="${currentProject.id}"]`);
  }

  if (selectedEl) selectedEl.classList.add('selected');
}

// Redraw whatever is currently on screen.
// Used after any data change (add, delete, complete) to keep the list in sync.
export function refreshView() {
  if (currentView === 'today') {
    renderTodo(filterTodayTasks());
  } else if (currentView === 'week') {
    renderTodo(filterWeekTasks());
  } else if (currentView === 'upcoming') {
    renderTodo(filterUpcomingTasks());
  } else if (currentView === 'completed') {
    renderTodo(filterCompletedTasks());
  } else {
    renderTodo(currentProject.todos);
  }
}

// ==== Sidebar events ====

// Event delegation: one listener on the <ul> instead of one per project.
// The <li> rows are recreated on every render, but the <ul> is permanent,
// so this listener never gets lost.
projectList.addEventListener('click', e => {
  const li = e.target.closest('li'); // the click may land on the span inside the row

  if (!li) return;
  const projectId = li.dataset.id;
  const projectFound = findProject(projectId);
  showProject(projectFound);
});

inboxBtn.addEventListener('click', () => {
  showProject(defaultProject());
});

// Filter views show tasks from every project, so they don't change currentProject
todayBtn.addEventListener('click', () => {
  currentView = 'today';
  renderTodo(filterTodayTasks());
  viewTitle.textContent = 'Today';
  updateSelected();
});

weekBtn.addEventListener('click', () => {
  currentView = 'week';
  renderTodo(filterWeekTasks());
  viewTitle.textContent = 'This Week';
  updateSelected();
});

upcomingBtn.addEventListener('click', () => {
  currentView = 'upcoming';
  renderTodo(filterUpcomingTasks());
  viewTitle.textContent = 'Upcoming';
  updateSelected();
});

completedBtn.addEventListener('click', () => {
  currentView = 'completed';
  renderTodo(filterCompletedTasks());
  viewTitle.textContent = 'Completed';
  updateSelected();
});

// ==== Forms ====

// Show/hide by toggling a class, so how "hidden" looks stays in the CSS
function hiddenToggle() {
  projectForm.classList.toggle('hidden');
}

function todoToggle() {
  todoForm.classList.toggle('hidden');
}

addProjectBtn.addEventListener('click', hiddenToggle);

closeFormBtn.addEventListener('click', hiddenToggle);

addTaskBtn.addEventListener('click', todoToggle);

closeTodoBtn.addEventListener('click', todoToggle);

projectForm.addEventListener('submit', e => {
  e.preventDefault(); // stop the browser from reloading the page
  const name = projectNameInput.value.trim();

  // `required` on the input doesn't catch a name made only of spaces
  if (!name.trim()) {
    alert('Please provide a title');
    return;
  }
  addProject(name);
  renderProject();
  hiddenToggle();
  projectNameInput.value = '';
});

todoForm.addEventListener('submit', e => {
  e.preventDefault(); // stop the browser from reloading the page
  const name = todoNameInput.value.trim();

  if (!name.trim()) {
    alert('Please provide a task name');
    return;
  }
  const todo = new Todo(
    name,
    todoDescription.value,
    todoDate.value,
    todoPriority.value,
  );

  // Filter views (Today, Upcoming...) aren't real projects,
  // so tasks created from them go to the Inbox
  if (currentView === 'project') {
    currentProject.addTodo(todo);
  } else {
    defaultProject().addTodo(todo);
  }

  saveAll();
  refreshView();

  todoToggle();
  todoForm.reset();
});
