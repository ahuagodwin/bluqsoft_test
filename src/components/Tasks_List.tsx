import React from "react";


const Tasks_List: React.FC<TasksProps> = ({ tasks }) => {
  return (
    <div className="tasks">
      {tasks?.map((task) => (
        <section key={task?.id} className="tasks_items">
          <span>{task?.title}</span>
          <span
            className={`${task?.completed}`}
          >
            {task?.completed === true ? "Completed" : "Pending"}
          </span>
        </section>
      ))}
    </div>
  );
};

export default Tasks_List;
