export interface CreateTaskDto {
  title: string;
  description: string;
  dueDate: Date | string;
  userId: string;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  dueDate?: Date | string;
  completed?: boolean;
}