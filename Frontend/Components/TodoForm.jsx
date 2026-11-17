import React, { useState } from "react";

export function TodoForm({ onAdd }) {
  const [title, setTitle] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;
    onAdd(trimmedTitle);
    setTitle("");
  };

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <label className="sr-only" htmlFor="new-todo">New todo</label>
      <input
        id="new-todo"
        type="text"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="What needs to get done?"
        autoComplete="off"
        maxLength={120}
      />
      <button type="submit">
        <span aria-hidden="true">＋</span> Add todo
      </button>
    </form>
  );
}
