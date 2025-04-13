import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { GetUsersUseCase } from '../../../../../../../../src/app/features/tasks/application/usecases/get-users.usecase';
import { UserRepository } from '../../../../../../../../src/app/features/tasks/domain/repositories/user.repository';
import { User } from '../../../../../../../../src/app/features/tasks/domain/models/user.model';

describe('GetUsersUseCase', () => {
  let usecase: GetUsersUseCase;
  let userRepository: jasmine.SpyObj<UserRepository>;

  const mockUsers: User[] = [
    {
      id: 'user1',
      name: 'User 1',
      avatar: 'avatar1.png'
    },
    {
      id: 'user2',
      name: 'User 2',
      avatar: 'avatar2.png'
    }
  ];

  beforeEach(() => {
    // Create a spy for the UserRepository
    const userRepositorySpy = jasmine.createSpyObj('UserRepository', ['getUsers']);

    TestBed.configureTestingModule({
      providers: [
        GetUsersUseCase,
        { provide: UserRepository, useValue: userRepositorySpy }
      ]
    });

    // Inject both the service-to-test and its (spy) dependency
    usecase = TestBed.inject(GetUsersUseCase);
    userRepository = TestBed.inject(UserRepository) as jasmine.SpyObj<UserRepository>;
  });

  it('should be created', () => {
    expect(usecase).toBeTruthy();
  });

  it('should return all users', (done) => {
    // Arrange
    userRepository.getUsers.and.returnValue(of(mockUsers));

    // Act
    usecase.execute().subscribe(users => {
      // Assert
      expect(users).toEqual(mockUsers);
      expect(userRepository.getUsers).toHaveBeenCalled();
      done();
    });
  });

  it('should return empty array when no users are found', (done) => {
    // Arrange
    userRepository.getUsers.and.returnValue(of([]));

    // Act
    usecase.execute().subscribe(users => {
      // Assert
      expect(users).toEqual([]);
      expect(userRepository.getUsers).toHaveBeenCalled();
      done();
    });
  });

  it('should propagate errors from the repository', (done) => {
    // Arrange
    const error = new Error('Repository error');
    userRepository.getUsers.and.returnValue(throwError(() => error));

    // Act
    usecase.execute().subscribe({
      next: () => {
        fail('Expected error but got success');
      },
      error: (err) => {
        // Assert
        expect(err).toBe(error);
        expect(userRepository.getUsers).toHaveBeenCalled();
        done();
      }
    });
  });

  it('should handle users without avatars', (done) => {
    // Arrange
    const usersWithoutAvatars: User[] = [
      {
        id: 'user1',
        name: 'User 1'
      },
      {
        id: 'user2',
        name: 'User 2'
      }
    ];
    userRepository.getUsers.and.returnValue(of(usersWithoutAvatars));

    // Act
    usecase.execute().subscribe(users => {
      // Assert
      expect(users).toEqual(usersWithoutAvatars);
      expect(users[0].avatar).toBeUndefined();
      expect(users[1].avatar).toBeUndefined();
      expect(userRepository.getUsers).toHaveBeenCalled();
      done();
    });
  });
});
