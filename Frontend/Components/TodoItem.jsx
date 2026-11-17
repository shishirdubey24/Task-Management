import React from "react";

export function TodoItem({ todo, onToggle, onDelete }) {
  return (
    <li className={`todo-item ${todo.completed ? "is-complete" : ""}`}>
      <button
        className="check-button"
        type="button"
        aria-label={todo.completed ? `Mark ${todo.title} as not completed` : `Mark ${todo.title} as completed`}
        aria-pressed={todo.completed}
        onClick={() => onToggle(todo.id)}
      >
        {todo.completed && <span aria-hidden="true">✓</span>}
      </button>
      <span className="todo-title">{todo.title}</span>
      <span className="status-label">{todo.completed ? "Done" : "To do"}</span>
      <button
        className="delete-button"
        type="button"
        aria-label={`Delete ${todo.title}`}
        onClick={() => onDelete(todo.id)}
      >
        <span aria-hidden="true">×</span>
      </button>
    </li>
  );
}
