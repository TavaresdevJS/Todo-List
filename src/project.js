// project.js

// Blueprint for a fingle project, each `new Project(...)` will create one project object
export class Project {
  constructor(name) {
    this.name = name;
    this.id = crypto.randomUUID(); // Creates a random ID number string so we can find and delete this exact project
    this.todos = []; // This project's tasks start empty
  }

  // Add a task to the end of this project's list
  addTodo(todo) {
    this.todos.push(todo);
  }

  // Remove a task by id. filter KEEPS every task except the matching one
  // and returns a NEW array, so we must assign it back to this.todos
  removeTodo(id) {
    this.todos = this.todos.filter(todo => todo.id !== id);
  }

  // Return the task with this id, or undefined if it's not in this project
  // (deleteTodo uses this to find which project owns a task)
  findTodo(id) {
    return this.todos.find(todo => todo.id === id);
  }
}
