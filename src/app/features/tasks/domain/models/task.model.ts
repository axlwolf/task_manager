export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  userId: string;
  completed: boolean;
}