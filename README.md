# Todo List

A task manager built for [The Odin Project](https://www.theodinproject.com/lessons/node-path-javascript-todo-list).
Layout and colors inspired by [Todoist](https://www.todoist.com).

## Features

- Create and delete projects (the Inbox is the default project and can't be deleted)
- Add tasks with a title, due date, priority, and description
- Mark tasks as complete
- Click a task to see its description, and edit it inline
- Filter views: Today, This Week, Upcoming, and Completed
- Data is saved in localStorage, so it survives page reloads

## Built with

- JavaScript (ES modules, classes)
- Webpack
- [date-fns](https://date-fns.org/) for date formatting and filtering
- localStorage for persistence

## What I learned

- Using an external library from npm for the first time (date-fns), and reading its docs to find the functions I needed
- Using classes to create multiple objects, and ES modules to split the app into files with clear jobs (data, storage, DOM)
- Saving data with localStorage: it only stores strings, so I used JSON.stringify/JSON.parse and rebuilt the class instances on load so their methods would work again
- Keeping data private inside a module, so other files can only change it through the functions I export
- Refactoring: when I added the filter views, I had to change my render function to accept any list of tasks instead of a whole project, which taught me to make functions ask only for what they use

## Run it locally

```bash
git clone https://github.com/TavaresdevJS/Todo-List.git
cd Todo-List
npm install
npm run dev
```
