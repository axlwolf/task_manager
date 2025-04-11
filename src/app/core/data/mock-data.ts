import { User } from '../models/user.model';
import { Task } from '../models/task.model';

export const USERS: User[] = [
  {
    id: '1',
    name: 'Jasmine Washington'
  },
  {
    id: '2',
    name: 'Emily Thompson'
  },
  {
    id: '3',
    name: 'Marcus Johnson'
  },
  {
    id: '4',
    name: 'David Miller'
  },
  {
    id: '5',
    name: 'Priya Patel'
  },
  {
    id: '6',
    name: 'Arjun Singh'
  }
];

export const TASKS: Task[] = [
  {
    id: '1',
    title: 'Master Angular',
    description: 'Learn all the basic and advanced features of Angular & how to apply them',
    dueDate: new Date('2025-12-31'),
    userId: '1',
    completed: false
  }
];