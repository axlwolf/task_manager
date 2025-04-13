import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { UserListComponent } from './user-list.component';
import { TasksStoreService } from '../../services/tasks-store.service';
import { User } from '../../../domain/models/user.model';
import { signal } from '@angular/core';

describe('UserListComponent', () => {
  let component: UserListComponent;
  let fixture: ComponentFixture<UserListComponent>;
  let tasksStore: jasmine.SpyObj<TasksStoreService>;

  const mockUsers: User[] = [
    { id: 'user1', name: 'User 1', avatar: 'avatar1.png' },
    { id: 'user2', name: 'User 2' },
    { id: 'user3', name: 'User 3', avatar: 'avatar3.png' }
  ];

  beforeEach(async () => {
    // Create spy for TasksStoreService
    tasksStore = jasmine.createSpyObj('TasksStoreService', ['selectUser']);
    
    // Add signal properties to the spy
    Object.defineProperty(tasksStore, 'users', {
      get: () => signal(mockUsers).asReadonly()
    });
    
    Object.defineProperty(tasksStore, 'selectedUserId', {
      get: () => signal('user1').asReadonly()
    });

    await TestBed.configureTestingModule({
      imports: [UserListComponent],
      providers: [
        { provide: TasksStoreService, useValue: tasksStore }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display all users from the store', () => {
    const userItems = fixture.debugElement.queryAll(By.css('.user-item'));
    expect(userItems.length).toBe(mockUsers.length);
  });

  it('should display user names', () => {
    const userItems = fixture.debugElement.queryAll(By.css('.user-item span:not(:first-child)'));
    
    expect(userItems[0].nativeElement.textContent).toBe('User 1');
    expect(userItems[1].nativeElement.textContent).toBe('User 2');
    expect(userItems[2].nativeElement.textContent).toBe('User 3');
  });

  it('should display avatar images for users with avatars', () => {
    const avatarImages = fixture.debugElement.queryAll(By.css('.avatar img'));
    expect(avatarImages.length).toBe(2); // Only 2 users have avatars
    
    expect(avatarImages[0].nativeElement.src).toContain('avatar1.png');
    expect(avatarImages[1].nativeElement.src).toContain('avatar3.png');
  });

  it('should display first letter of name for users without avatars', () => {
    const avatarLetters = fixture.debugElement.queryAll(By.css('.avatar span'));
    expect(avatarLetters.length).toBe(1); // Only 1 user has no avatar
    
    expect(avatarLetters[0].nativeElement.textContent.trim()).toBe('U'); // First letter of "User 2"
  });

  it('should highlight the selected user', () => {
    const userItems = fixture.debugElement.queryAll(By.css('.user-item'));
    
    // First user should have the active background color
    const firstUserStyle = userItems[0].nativeElement.style.backgroundColor;
    expect(firstUserStyle).toBe('var(--color-sidebar-item-active)');
    
    // Other users should have the default background color
    const secondUserStyle = userItems[1].nativeElement.style.backgroundColor;
    expect(secondUserStyle).toBe('var(--color-sidebar-bg)');
  });

  it('should call selectUser when a user is clicked', () => {
    const userItems = fixture.debugElement.queryAll(By.css('.user-item'));
    
    // Click on the second user
    userItems[1].triggerEventHandler('click', null);
    
    expect(tasksStore.selectUser).toHaveBeenCalledWith('user2');
  });

  it('should update hoverUserId on mouseenter', () => {
    const userItems = fixture.debugElement.queryAll(By.css('.user-item'));
    
    // Trigger mouseenter on the second user
    userItems[1].triggerEventHandler('mouseenter', null);
    
    expect(component['hoverUserId']).toBe('user2');
  });

  it('should clear hoverUserId on mouseleave', () => {
    const userItems = fixture.debugElement.queryAll(By.css('.user-item'));
    
    // Set hoverUserId first
    component['hoverUserId'] = 'user2';
    
    // Trigger mouseleave on the second user
    userItems[1].triggerEventHandler('mouseleave', null);
    
    expect(component['hoverUserId']).toBeNull();
  });
});
