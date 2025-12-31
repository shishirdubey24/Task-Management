import { Routes, Route } from "react-router-dom";
import { Login } from "./Router/Login";
import { Register } from "./Router/Register";
import { Todo } from "./Components/Todo";
import { TaskDetails } from "./Components/TaskDetails";
import { TaskEdit } from "./Components/TaskEdit";
import ProtectedRoute from "./Components/ProtectedRoute";

const App = () => {
  return (
    <Routes>
      {/* Public home page */}
      <Route path="/" element={<Todo />} />

      {/* Protected routes */}
      <Route
        path="/task/:id"
        element={
          <ProtectedRoute>
            <TaskDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/task/edit/:id"
        element={
          <ProtectedRoute>
            <TaskEdit />
          </ProtectedRoute>
        }
      />

      {/* Auth routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
};

export default App;