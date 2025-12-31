import { useEffect, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchTasks, deleteTask, updateTask } from "../store/TaskSlice";
import { Link } from "react-router-dom";
import { MdDeleteForever, MdEdit, MdVisibility, MdCheckCircle, MdRadioButtonUnchecked } from "react-icons/md";
import AuthContext from "./AuthContext";

export const TodoList = () => {
  const { tasks, currentPage, totalPages, status } = useSelector((state) => state.task);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    dispatch(fetchTasks({ page: currentPage }));
  }, [dispatch, currentPage]);

  const handleDelete = (id) => {
    // ✅ Check if user is logged in
    if (!user) {
      alert("Please login to delete tasks");
      navigate("/login");
      return;
    }

    if (window.confirm("Are you sure you want to delete this task?")) {
      dispatch(deleteTask(id));
    }
  };

  const handleStatusChange = (task) => {
    // ✅ Check if user is logged in
    if (!user) {
      alert("Please login to update tasks");
      navigate("/login");
      return;
    }

    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    dispatch(updateTask({ id: task._id, status: newStatus }));
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      dispatch(fetchTasks({ page: newPage }));
    }
  };

  const handleViewClick = (e) => {
    // ✅ Check if user is logged in
    if (!user) {
      e.preventDefault();
      alert("Please login to view task details");
      navigate("/login");
    }
  };

  const handleEditClick = (e) => {
    // ✅ Check if user is logged in
    if (!user) {
      e.preventDefault();
      alert("Please login to edit tasks");
      navigate("/login");
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'priority-high';
      case 'Medium': return 'priority-medium';
      case 'Low': return 'priority-low';
      default: return '';
    }
  };

  if (status === 'loading') return <div className="loading">Loading tasks...</div>;

  const priorityRank = {
    High: 1,
    Medium: 2,
    Low: 3,
  };

  const sortedTasks = [...tasks].sort(
    (a, b) => priorityRank[a.priority] - priorityRank[b.priority]
  );

  return (
    <div className="task-list-container">
      <ul className="task-list">
        {sortedTasks.map((task) => (
          <li key={task._id} className={`task-item ${getPriorityColor(task.priority)}`}>
            <div className="task-header">
              <span 
                className={`task-status ${task.status}`} 
                onClick={() => handleStatusChange(task)}
                style={{ cursor: 'pointer' }}
              >
                {task.status === 'completed' ? <MdCheckCircle /> : <MdRadioButtonUnchecked />}
              </span>
              <span className={`task-title ${task.status === 'completed' ? 'completed-text' : ''}`}>
                {task.title}
              </span>
              <span className="task-priority-badge">{task.priority}</span>
            </div>
            <div className="task-meta">
              <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
            </div>
            <div className="task-actions">
              <Link 
                to={`/task/${task._id}`} 
                className="action-btn view-btn"
                onClick={(e) => handleViewClick(e, task._id)}
              >
                <MdVisibility />
              </Link>
              <Link 
                to={`/task/edit/${task._id}`} 
                className="action-btn edit-btn"
                onClick={(e) => handleEditClick(e, task._id)}
              >
                <MdEdit />
              </Link>
              <button 
                onClick={() => handleDelete(task._id)} 
                className="action-btn delete-btn"
              >
                <MdDeleteForever />
              </button>
            </div>
          </li>
        ))}
        {tasks.length === 0 && (
          <p className="no-tasks">
            {user ? "No tasks found." : "Please login to view your tasks."}
          </p>
        )}
      </ul>

      {tasks.length > 0 && (
        <div className="pagination">
          <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
            Prev
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
            Next
          </button>
        </div>
      )}
    </div>
  );
};