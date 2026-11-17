import  { useEffect, useMemo, useState } from "react";
import { TodoForm } from "./Components/TodoForm";
import { TodoList } from "./Components/TodoList";

const STORAGE_KEY = "simple-todos";

function readTodos() {
  try {
    const savedTodos = localStorage.getItem(STORAGE_KEY);
    return savedTodos ? JSON.parse(savedTodos) : [];
  } catch {
    return [];
  }
}

function App() {
  const [todos, setTodos] = useState(readTodos);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  const visibleTodos = useMemo(() => {
    if (filter === "active") return todos.filter((todo) => !todo.completed);
    if (filter === "completed") return todos.filter((todo) => todo.completed);
    return todos;
  }, [filter, todos]);

  const addTodo = (title) => {
    setTodos((currentTodos) => [
      { id: `${Date.now()}-${Math.random()}`, title, completed: false },
      ...currentTodos,
    ]);
  };

  const toggleTodo = (id) => {
    setTodos((currentTodos) =>
      currentTodos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id) => {
    setTodos((currentTodos) => currentTodos.filter((todo) => todo.id !== id));
  };

  const clearCompleted = () => {
    setTodos((currentTodos) => currentTodos.filter((todo) => !todo.completed));
  };

  const remainingCount = todos.filter((todo) => !todo.completed).length;

  return (
    <main className="page-shell">
      <section className="todo-card" aria-labelledby="page-title">
        <header className="app-header">
          <div>
            <p className="eyebrow">A little progress, every day</p>
            <h1 id="page-title">My todos<span>.</span></h1>
          </div>
          <div className="header-mark" aria-hidden="true">✓</div>
        </header>

        <TodoForm onAdd={addTodo} />

        <section className="todos-section" aria-label="Your todo list">
          <div className="list-heading">
            <div>
              <h2>Your list</h2>
              <p>{remainingCount} {remainingCount === 1 ? "task" : "tasks"} left to do</p>
            </div>
            <div className="filters" aria-label="Filter todos">
              {["all", "active", "completed"].map((option) => (
                <button
                  className={`filter-button ${filter === option ? "selected" : ""}`}
                  key={option}
                  type="button"
                  aria-pressed={filter === option}
                  onClick={() => setFilter(option)}
                >
                  {option === "active" ? "To do" : option[0].toUpperCase() + option.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <TodoList
            todos={visibleTodos}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
            filter={filter}
          />

          {todos.some((todo) => todo.completed) && (
            <button className="clear-button" type="button" onClick={clearCompleted}>
              Clear completed
            </button>
          )}
        </section>

        <footer className="app-footer">Your todos stay saved on this device.</footer>
      </section>
    </main>
  );
}

export default App;
