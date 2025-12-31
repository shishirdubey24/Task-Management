// store.js
import { configureStore } from "@reduxjs/toolkit";
import taskReducer from "./TaskSlice";
//import authReducer from "./Auth";

const myStore = configureStore({
  reducer: {
    task: taskReducer,
    // auth: authReducer,
  },
});

export default myStore;
