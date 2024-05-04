

interface Tasks {
    id: number;
    title: string;
    completed: boolean;
  }


interface TasksProps {
    tasks: Tasks[]
}

interface TasksState {
  tasks: Tasks[];
  isLoading: boolean;
  progress: number;
  statusText: string;
  error: string | null; 
  cancelClicked: boolean; 
  controller: AbortController | null;
}

interface ProgressProps {
  percent: number,
  statusText: string
}
