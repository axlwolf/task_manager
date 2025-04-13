import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { GetUsersUseCase } from '../../../../../../../../src/app/features/tasks/application/usecases/get-users.usecase';
import { UserRepository } from '../../../../../../../../src/app/features/tasks/domain/repositories/user.repository';
import { User } from '../../../../../../../../src/app/features/tasks/domain/models/user.model';

describe('GetUsersUseCase', () => {
  const mockUsers: User[] = [
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

  const setup = (config?: {
    mockUserRepository?: {
      getUsers?: jasmine.Spy;
    };
  }) => {
    // Create a spy for the UserRepository
    const userRepositorySpy = jasmine.createSpyObj('UserRepository', [
      'getUsers',
    ]);

    // Configure the spy if provided in config
    if (config?.mockUserRepository?.getUsers) {
      userRepositorySpy.getUsers = config.mockUserRepository.getUsers;
    }

    TestBed.configureTestingModule({
      providers: [
        GetUsersUseCase,
        { provide: UserRepository, useValue: userRepositorySpy },
      ],
    });

    // Inject both the service-to-test and its (spy) dependency
    const usecase = TestBed.inject(GetUsersUseCase);
    const userRepository = TestBed.inject(
      UserRepository
    ) as jasmine.SpyObj<UserRepository>;

    return { usecase, userRepository };
  };

  it('should be created', () => {
    const { usecase } = setup();
    expect(usecase).toBeTruthy();
  });

  it('should return all users', (done) => {
    // Arrange
    const userRepositorySpy = jasmine
      .createSpy('getUsers')
      .and.returnValue(of(mockUsers));
    const { usecase, userRepository } = setup({
      mockUserRepository: {
        getUsers: userRepositorySpy,
      },
    });

    // Act
    usecase.execute().subscribe((users) => {
      // Assert
      expect(users).toEqual(mockUsers);
      expect(userRepository.getUsers).toHaveBeenCalled();
      done();
    });
  });

  it('should return empty array when no users are found', (done) => {
    // Arrange
    const userRepositorySpy = jasmine
      .createSpy('getUsers')
      .and.returnValue(of([]));
    const { usecase, userRepository } = setup({
      mockUserRepository: {
        getUsers: userRepositorySpy,
      },
    });

    // Act
    usecase.execute().subscribe((users) => {
      // Assert
      expect(users).toEqual([]);
      expect(userRepository.getUsers).toHaveBeenCalled();
      done();
    });
  });

  it('should propagate errors from the repository', (done) => {
    // Arrange
    const error = new Error('Repository error');
    const userRepositorySpy = jasmine
      .createSpy('getUsers')
      .and.returnValue(throwError(() => error));
    const { usecase, userRepository } = setup({
      mockUserRepository: {
        getUsers: userRepositorySpy,
      },
    });

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
      },
    });
  });

  it('should handle users without avatars', (done) => {
    // Arrange
    const usersWithoutAvatars: User[] = [
      {
        id: 'user1',
        name: 'User 1',
      },
      {
        id: 'user2',
        name: 'User 2',
      },
    ];
    const userRepositorySpy = jasmine
      .createSpy('getUsers')
      .and.returnValue(of(usersWithoutAvatars));
    const { usecase, userRepository } = setup({
      mockUserRepository: {
        getUsers: userRepositorySpy,
      },
    });

    // Act
    usecase.execute().subscribe((users) => {
      // Assert
      expect(users).toEqual(usersWithoutAvatars);
      expect(users[0].avatar).toBeUndefined();
      expect(users[1].avatar).toBeUndefined();
      expect(userRepository.getUsers).toHaveBeenCalled();
      done();
    });
  });
});
