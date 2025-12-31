import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5000/tasks";

// ✅ frontend auth helper
const authConfig = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Fetch tasks
export const fetchTasks = createAsyncThunk(
  "task/fetchTasks",
  async ({ page = 1 }, { rejectWithValue }) => {
    const config = authConfig();
    if (!config) return rejectWithValue("Not authenticated");

    try {
      const res = await axios.get(`${API_URL}?page=${page}&limit=5`, config);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Fetch failed");
    }
  }
);

// Fetch single task
export const getTask = createAsyncThunk(
  "task/getTask",
  async (id, { rejectWithValue }) => {
    const config = authConfig();
    if (!config) return rejectWithValue("Not authenticated");

    try {
      const res = await axios.get(`${API_URL}/${id}`, config);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Fetch failed");
    }
  }
);

// Add task
export const addTask = createAsyncThunk(
  "task/addTask",
  async (taskData, { rejectWithValue }) => {
    const config = authConfig();
    if (!config) return rejectWithValue("Not authenticated");

    try {
      const res = await axios.post(API_URL, taskData, config);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Add failed");
    }
  }
);

// Update task
export const updateTask = createAsyncThunk(
  "task/updateTask",
  async ({ id, ...data }, { rejectWithValue }) => {
    const config = authConfig();
    if (!config) return rejectWithValue("Not authenticated");

    try {
      const res = await axios.put(`${API_URL}/${id}`, data, config);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Update failed");
    }
  }
);

// Delete task
export const deleteTask = createAsyncThunk(
  "task/deleteTask",
  async (id, { rejectWithValue }) => {
    const config = authConfig();
    if (!config) return rejectWithValue("Not authenticated");

    try {
      await axios.delete(`${API_URL}/${id}`, config);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Delete failed");
    }
  }
);

const taskSlice = createSlice({
  name: "task",
  initialState: {
    tasks: [],
    currentTask: null,
    currentPage: 1,
    totalPages: 1,
    status: "idle",
    error: null,
  },
  reducers: {
    clearTasks(state) {
      state.tasks = [];
      state.currentTask = null;
      state.currentPage = 1;
      state.totalPages = 1;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.tasks = action.payload.tasks;
        state.currentPage = action.payload.currentPage;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(getTask.fulfilled, (state, action) => {
        state.currentTask = action.payload;
      })
      .addCase(addTask.fulfilled, (state, action) => {
        state.tasks.unshift(action.payload);
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex(
          (t) => t._id === action.payload._id
        );
        if (index !== -1) state.tasks[index] = action.payload;
        if (state.currentTask?._id === action.payload._id) {
          state.currentTask = action.payload;
        }
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter((task) => task._id !== action.payload);
      });
  },
});

export const { clearTasks } = taskSlice.actions;
export default taskSlice.reducer;
