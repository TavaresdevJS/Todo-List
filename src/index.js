// index.js
import { Todo } from './todo.js';
import { Project } from './project.js';
import {
  addProject,
  getProjects,
  deleteProject,
  findProject,
  defaultProject,
} from './projectManager.js';

const groceries = addProject('Groceries');
const gym = addProject('Gym');

const todoDefault = new Todo('Inbox', '.', '.', '.', '.');

const todo1 = new Todo(
  'buy milk',
  'go to the supermarket buy milk',
  '2026-11-05',
  'high',
  'new todo yay',
);

const todo2 = new Todo(
  'Exercise',
  'Go to the gym and lift weight',
  '2026-12-05',
  'medium',
  'Leg day',
);

const inbox = defaultProject();

inbox.addTodo(todoDefault);
groceries.addTodo(todo1);
gym.addTodo(todo2);

console.log({ inbox });
console.log({ groceries });
console.log({ gym });

todo1.toggleComplete();
console.log(todo1.completed);
console.log(todo2.completed);

groceries.removeTodo(todo1.id);
deleteProject(gym.id);
console.log(getProjects());
deleteProject(inbox.id);
console.log(getProjects());
console.log(findProject(groceries.id));
console.log(inbox.findTodo(todoDefault.id));
