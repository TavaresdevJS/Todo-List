// todo.js

export class Todo {
  constructor(title, description, dueDate, priority) {
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
    this.id = crypto.randomUUID();
    this.completed = false;
  }
  toggleComplete() {
    this.completed = !this.completed;
  }
}
