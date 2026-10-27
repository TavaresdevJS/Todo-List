// index.js
import { Todo } from './todo.js';

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

todo1.toggleComplete();
console.log(todo1.completed);
todo1.toggleComplete();
console.log(todo1.completed);

console.log({ todo1 });
console.log({ todo2 });

console.log('Hello world!');
console.log('Hi!');
