// tasksSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Importing axios for making HTTP requests
import axios from "axios";

// Importing RootState type from '../connect/Connect' for type safety
import { RootState } from "../connect/Connect";


// defining batch size for loading tasks
const BATCH_SIZE = 5;

// initial state for tasks slice, loading from localStorage if available
const initialState: TasksState = JSON.parse(
  localStorage.getItem("tasksState") ||
    JSON.stringify({
      tasks: [],
      isLoading: false,
      progress: 0,
      statusText: "In Progress",
      error: null,
      cancelClicked: false,
    })
);

// Defining asynchronous thunk action creator fetchTasks to fetch tasks from API
export const fetchTasks = createAsyncThunk(
  "tasks/fetchTasks",
  async (_, { getState, dispatch, rejectWithValue }) => {
    const state = getState() as RootState;
    // Checking if tasks are already present in the state
    if (state.tasks.tasks.length > 0) {
      return state.tasks.tasks;
    }
    try {
      const response = await axios.get(
        "https://jsonplaceholder.typicode.com/todos"
      );
      const data = response.data;
      const totalTasks = data.length;
      let loadedTasks: Tasks[] = [];

      for (let i = 0; i < totalTasks; i += BATCH_SIZE) {
        if (state.tasks.cancelClicked) {
          // If cancel button clicked, dispatch cancelImport action and return
          dispatch(cancelImport({ progress: 0, tasks: [], statusText: "Cancelled"}));
          return;
        }

        // Concatenating tasks in batches and updating progress
        loadedTasks = loadedTasks.concat(data.slice(i, i + BATCH_SIZE));
        if (!state.tasks.cancelClicked) {
          const newProgress = (i + BATCH_SIZE) / totalTasks * 100;
          dispatch(updateProgressAndTasks({ progress: newProgress, tasks: loadedTasks }));
        }
        // Simulating delay using setTimeout
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      return loadedTasks;
    } catch (error: any) {
      // If error occur, reject with error message
      return rejectWithValue(error.message);
    }
  }
);

// Defining tasksSlice for managing tasks state
export const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  // Reducer to handle cancelling import process
  reducers: {
    cancelImport: (state, action) => {
      state.error = null;
      state.statusText = action.payload.statusText;
      state.isLoading = false;
      state.cancelClicked = true;
      state.progress = action.payload.progress;
      state.tasks = action.payload.tasks;
      localStorage.setItem("tasksState", JSON.stringify(state));
    },
    // Reducer to update progress and tasks
    updateProgressAndTasks: (state, action) => {
      if (!state.cancelClicked) {
        state.progress = action.payload.progress;
        state.tasks = action.payload.tasks;
        localStorage.setItem('tasksState', JSON.stringify(state));
      }
    },
  },
  // Defining extra reducers to handle async thunk actions
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.error = null;
        state.isLoading = true;
        state.statusText = "In Progress";
        localStorage.setItem("tasksState", JSON.stringify(state));
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        if (!state.cancelClicked) {
          state.isLoading = false;
          state.error = null;
          state.statusText = "Completed";
          state.tasks = action.payload as Tasks[];
          // Saving state to localStorage only if not cancelled
          localStorage.setItem("tasksState", JSON.stringify(state));
        }
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.isLoading = false;
        state.statusText = "Cancelled";
        state.error = action.payload as string;
      });
  },
});

export const { cancelImport,updateProgressAndTasks } = tasksSlice.actions;

export default tasksSlice.reducer;
