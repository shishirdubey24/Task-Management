import { useState, useContext, useEffect } from "react";
import { useDispatch } from "react-redux";
import { TodoForm } from "./TodoForm";
import { TodoList } from "./TodoList";
import { TodoDate } from "./TodoDate";
import AuthContext from "./AuthContext";
import { fetchTasks } from "../store/TaskSlice";
import { useNavigate } from "react-router-dom";

export const Todo = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, setUser, loading } = useContext(AuthContext);
  const [open, setOpen] = useState(false);

  //  Fetch tasks only if user is logged in
  useEffect(() => {
    if (user) {
      dispatch(fetchTasks({ page: 1 }));
    }
  }, [user, dispatch]);

  if (loading) return null; // or loader

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setOpen(false);
    navigate("/login");
  };

  const initials = user?.username
    ? user.username
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
    : "U";

  return (
    <div className="main-layout">
      <section className="todo-app-container">
        <header className="app-header">
          <div className="header-content">
            <h1>My Tasks</h1>
            <TodoDate />
          </div>

          {/* Profile Area */}
          <div className="profile-wrapper">
            {user ? (
              <>
                <button
                  type="button"
                  className="avatar-trigger"
                  onClick={() => setOpen((prev) => !prev)}
                >
                  {initials}
                </button>

                {open && (
                  <div className="profile-card">
                    <div className="profile-card-header">
                      <div className="avatar-circle large">
                        {initials}
                      </div>

                      <div>
                        <p className="profile-name">{user.username}</p>
                        <p className="profile-email">{user.email}</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="profile-logout"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </>
            ) : (
              <button
                type="button"
                className="logout-button"
                onClick={() => navigate("/login")}
              >
                Login / Signup
              </button>
            )}
          </div>
        </header>

        <TodoForm />

        <section className="list-section">
          <TodoList />
        </section>
      </section>
    </div>
  );
};