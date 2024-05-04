import { configureStore } from '@reduxjs/toolkit';
import tasksReducer from "../services/Todos"

// Configuring the Redux store
export const store = configureStore({
    reducer: {
        tasks: tasksReducer // Assigning tasksReducer to 'tasks' slice in the store
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
});

// Defining RootState type as the return type of store.getState()
export type RootState = ReturnType<typeof store.getState>;
