// project.js
export class Project {
  constructor(name) {
    this.name = name;
    this.id = crypto.randomUUID();
    this.todos = [];
  }
  addTodo(todo) {
    this.todos.push(todo);
  }
  removeTodo(id) {
    this.todos = this.todos.filter(todo => todo.id !== id);
  }
}
