// todo.js

// Blueprint for a single task. Each `new Todo(...)` creates one task object.
export class Todo {
  constructor(title, description, dueDate, priority) {
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
    this.id = crypto.randomUUID(); // Unique ID (a random string) so we can find and delete this exact task
    this.completed = false; // Every new task created will start as not done
  }
  // Flip the task between done and not done (true <-> false)
  // Called when the user clicks the task's checkbox
  toggleComplete() {
    this.completed = !this.completed;
  }
}
