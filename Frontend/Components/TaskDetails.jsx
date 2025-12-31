import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getTask } from "../store/TaskSlice";
export const TaskDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentTask, status, error } = useSelector(
    (state) => state.task
  );

  useEffect(() => {
    dispatch(getTask(id));
  }, [id, dispatch]);

  if (status === "loading") {
    return <div className="loading">Loading details...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  if (!currentTask) {
    return <div className="error">Task not found</div>;
  }

  return (
    <div className="details-page">
      <div className="details-card">
        <div className="details-header">
          <h2>{currentTask.title}</h2>
          <span className={`priority-badge ${currentTask.priority}`}>
            {currentTask.priority}
          </span>
        </div>

        <div className="details-body">
          <p>
            <strong>Status:</strong> {currentTask.status}
          </p>
          <p>
            <strong>Due Date:</strong>{" "}
            {new Date(currentTask.dueDate).toLocaleDateString()}
          </p>
          <p>
            <strong>Description:</strong>
          </p>
          <p className="description-text">
            {currentTask.description || "No description provided."}
          </p>
        </div>

        <div className="details-actions">
          <Link to="/" className="back-btn">
            Back to List
          </Link>
          <Link
            to={`/task/edit/${currentTask._id}`}
            className="edit-btn"
          >
            Edit Task
          </Link>
        </div>
      </div>
    </div>
  );
};
