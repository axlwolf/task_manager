import { Task } from '../../domain/models/task.model';
import { User } from '../../domain/models/user.model';
import { CreateTaskDto } from '../dtos/task.dto';

/**
 * Mock data for task-related tests
 */
export const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Task 1',
    description: 'Description 1',
    dueDate: new Date('2023-12-31'),
    userId: 'user1',
    completed: false,
  },
  {
    id: '2',
    title: 'Task 2',
    description: 'Description 2',
    dueDate: new Date('2023-12-31'),
    userId: 'user1',
    completed: true,
  },
  {
    id: '3',
    title: 'Task 3',
    description: 'Description 3',
    dueDate: new Date('2023-12-31'),
    userId: 'user2',
    completed: false,
  },
];

/**
 * Mock data for user-related tests
 */
export const mockUsers: User[] = [
  {
    id: 'user1',
    name: 'User 1',
    avatar: 'avatar1.png',
  },
  {
    id: 'user2',
    name: 'User 2',
    avatar: 'avatar2.png',
  },
];

/**
 * Mock data for creating tasks
 */
export const mockCreateTaskDto: CreateTaskDto = {
  title: 'New Task',
  description: 'New Description',
  dueDate: '2023-12-31',
  userId: 'user1',
};

/**
 * Helper function to get tasks for a specific user
 */
export function getTasksForUser(userId: string): Task[] {
  return mockTasks.filter((task) => task.userId === userId);
}

/**
 * Helper function to get a task by ID
 */
export function getTaskById(taskId: string): Task | undefined {
  return mockTasks.find((task) => task.id === taskId);
}

/**
 * Helper function to get a user by ID
 */
export function getUserById(userId: string): User | undefined {
  return mockUsers.find((user) => user.id === userId);
}

/**
 * Helper function to create a completed version of a task
 */
export function createCompletedTask(task: Task): Task {
  return {
    ...task,
    completed: true,
  };
}
