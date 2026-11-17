import React from "react";
import { TodoItem } from "./TodoItem";

const emptyMessages = {
  all: ["Nothing on your list yet", "Add a todo above and it will show up here."],
  active: ["All caught up", "You have no todos left to do."],
  completed: ["No completed todos", "Finished todos will appear here."],
};

export function TodoList({ todos, onToggle, onDelete, filter }) {
  if (todos.length === 0) {
    const [title, message] = emptyMessages[filter];
    return (
      <div className="empty-state">
        <span className="empty-icon" aria-hidden="true">✳</span>
        <h3>{title}</h3>
        <p>{message}</p>
      </div>
    );
  }

  return (
    <ul className="todo-list">
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} onToggle={onToggle} onDelete={onDelete} />
      ))}
    </ul>
  );
}
