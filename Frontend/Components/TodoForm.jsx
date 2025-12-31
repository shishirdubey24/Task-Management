import { useRef, useContext } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addTask } from "../store/TaskSlice";
import AuthContext from "./AuthContext";

export const TodoForm = () => {
  const titleRef = useRef(null);
  const descriptionRef = useRef(null);
  const dueDateRef = useRef(null);
  const priorityRef = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const handleFormSubmit = (e) => {
    e.preventDefault();

    // ✅ Check if user is logged in
    if (!user) {
      alert("Please login to add tasks");
      navigate("/login");
      return;
    }

    const payload = {
      title: titleRef.current.value.trim(),
      description: descriptionRef.current.value,
      dueDate: dueDateRef.current.value,
      priority: priorityRef.current.value,
    };

    if (!payload.title || !payload.dueDate) {
      alert("Please fill in Title and Due Date");
      return;
    }

    dispatch(addTask(payload));

    // reset form
    e.target.reset();
    priorityRef.current.value = "Medium";
  };

  return (
    <section className="form-container">
      <h3>Create New Task</h3>

      <form onSubmit={handleFormSubmit} className="task-form">
        <div className="form-group">
          <input
            type="text"
            className="form-input"
            ref={titleRef}
            autoComplete="off"
            placeholder="Task Title"
            required
          />
        </div>

        <div className="form-group">
          <textarea
            className="form-input"
            ref={descriptionRef}
            placeholder="Description"
            rows="3"
          />
        </div>

        <div className="form-row">
          <div className="form-group half">
            <label>Due Date</label>
            <input
              type="date"
              className="form-input"
              ref={dueDateRef}
              required
            />
          </div>

          <div className="form-group half">
            <label>Priority</label>
            <select
              className="form-select"
              ref={priorityRef}
              defaultValue="Medium"
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>

        <button type="submit" className="add-task-btn">
          {user ? "Add Task" : "Login to Add Task"}
        </button>
      </form>
    </section>
  );
};