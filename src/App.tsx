// App.tsx
import React, { useEffect } from 'react';
import { Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { ErrorHandler, ProgressBar, TasksList } from './components';
import { RootState } from './connect/Connect';
import { cancelImport, fetchTasks } from './services/Todos';
import { ThunkDispatch } from '@reduxjs/toolkit';

const App: React.FC = () => {
  // Retrieving dispatch function from Redux store
  const dispatch: ThunkDispatch<any, any, any> = useDispatch();

  // Selecting relevant state variables from Redux store using useSelector
  const { tasks, isLoading, progress, statusText, error } = useSelector((state: RootState) => state.tasks);


  // useEffect hook to dispatch fetchTasks action on component mount
  useEffect(() => {
      dispatch(fetchTasks());
  }, [dispatch]);

  // Event handler for cancelling the importing tasks on button click
  const handleCancelClick = () => {
    dispatch(cancelImport({progress: 0, tasks: [], statusText: "Cancelled" }));
  };


  // Render error handler component if error state is true
  if(error) {
    return <ErrorHandler text={error} />
  }

  return (
    <div className="container">
      <h1 className="caption">Task Importer</h1>
      <div className="todo_container">
        <ProgressBar statusText={statusText} percent={progress} />

         {/* displaying task status and cancel button */}
        <section className="tasks_status_cancel_btn">
          <p>Status: {statusText}</p>

          {/* rendering cancel button if loading is true */}
          {isLoading && (
            <Button size="large" onClick={handleCancelClick}>
              Cancel Import Process
            </Button>
          )}
        </section>
        <section className="todo_wrapper">
          {/* Render error message if progress is 0, or if no tasks available, otherwise render TasksList */}
          {progress === 0 ? <ErrorHandler text="Task Importation Cancelled" /> : tasks?.length === 0 ? <ErrorHandler text="No Task Available for Importation" /> : <TasksList tasks={tasks} />}
        </section>
      </div>
    </div>
  );
};

export default App;
