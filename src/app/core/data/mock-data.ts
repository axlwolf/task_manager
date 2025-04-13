import { User } from '../../features/tasks/domain/models/user.model';
import { Task } from '../models/task.model';

// Using Dicebear API for avatars: https://www.dicebear.com/styles/avataaars
export const USERS: User[] = [
  {
    id: '1',
    name: 'Jasmine Washington',
    avatar:
      'https://api.dicebear.com/7.x/avataaars/svg?seed=Jasmine&backgroundColor=b6e3f4',
  },
  {
    id: '2',
    name: 'Emily Thompson',
    avatar:
      'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily&backgroundColor=d1d4f9',
  },
  {
    id: '3',
    name: 'Marcus Johnson',
    avatar:
      'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus&backgroundColor=c0aede',
  },
  {
    id: '4',
    name: 'David Miller',
    avatar:
      'https://api.dicebear.com/7.x/avataaars/svg?seed=David&backgroundColor=ffdfbf',
  },
  {
    id: '5',
    name: 'Priya Patel',
    avatar:
      'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya&backgroundColor=ffd5dc',
  },
  {
    id: '6',
    name: 'Arjun Singh',
    avatar:
      'https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun&backgroundColor=c1e1c5',
  },
];

export const TASKS: Task[] = [
  {
    id: '1',
    title: 'Master Angular',
    description:
      'Learn all the basic and advanced features of Angular & how to apply them',
    dueDate: new Date('2023-12-31'),
    userId: '1',
    completed: false,
  },
  {
    id: '2',
    title: 'Complete Project Documentation',
    description: 'Write comprehensive documentation for the EasyTask project',
    dueDate: new Date('2023-11-15'),
    userId: '1',
    completed: true,
  },
  {
    id: '3',
    title: 'Design User Interface',
    description: 'Create wireframes and mockups for the new dashboard',
    dueDate: new Date('2023-11-20'),
    userId: '2',
    completed: false,
  },
  {
    id: '4',
    title: 'Implement Authentication',
    description: 'Add user authentication and authorization to the application',
    dueDate: new Date('2023-12-05'),
    userId: '3',
    completed: false,
  },
  {
    id: '5',
    title: 'Optimize Performance',
    description: 'Identify and fix performance bottlenecks in the application',
    dueDate: new Date('2023-11-25'),
    userId: '4',
    completed: false,
  },
  {
    id: '6',
    title: 'Write Unit Tests',
    description: 'Increase test coverage for core components and services',
    dueDate: new Date('2023-12-10'),
    userId: '5',
    completed: false,
  },
  {
    id: '7',
    title: 'Deploy to Production',
    description:
      'Set up CI/CD pipeline and deploy the application to production',
    dueDate: new Date('2023-12-15'),
    userId: '6',
    completed: false,
  },
  {
    id: '8',
    title: 'User Testing',
    description: 'Conduct user testing sessions and gather feedback',
    dueDate: new Date('2023-11-30'),
    userId: '2',
    completed: true,
  },
  {
    id: '9',
    title: 'Fix Accessibility Issues',
    description: 'Ensure the application meets WCAG 2.1 AA standards',
    dueDate: new Date('2023-12-01'),
    userId: '3',
    completed: true,
  },
  {
    id: '10',
    title: 'Implement Dark Mode',
    description: 'Add dark mode support to improve user experience',
    dueDate: new Date('2023-12-20'),
    userId: '4',
    completed: false,
  },
];
