# Simple Todos

A small frontend-only todo app built with React and Vite. Add tasks, mark them complete or active, filter the list, and remove tasks. Todos are saved in the browser with `localStorage`.

## Run locally

```sh
cd Frontend
npm install
npm run dev
```

## Learn from the structure

- `Frontend/App.jsx` owns the todo state and uses `useEffect` to persist it to `localStorage`.
- `Frontend/Components/TodoForm.jsx` receives `onAdd` as a prop.
- `Frontend/Components/TodoList.jsx` receives the visible todos and event handlers as props, then passes each todo to `TodoItem`.
- `Frontend/Components/TodoItem.jsx` renders one todo and reports status or delete actions through props.

There is no server, account system, or external data API. Data stays in the current browser.
