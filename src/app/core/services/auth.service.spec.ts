import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { User } from '../../features/tasks/domain/models/user.model';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let localStorageSpy: jasmine.SpyObj<Storage>;

  const mockUser: User = {
    id: 'user1',
    name: 'Test User',
    avatar: 'avatar.png'
  };

  const mockToken = 'mock-jwt-token';

  beforeEach(() => {
    // Create spy for localStorage
    localStorageSpy = jasmine.createSpyObj('localStorage', ['getItem', 'setItem', 'removeItem']);
    
    // Mock localStorage methods
    spyOn(localStorage, 'getItem').and.callFake(localStorageSpy.getItem);
    spyOn(localStorage, 'setItem').and.callFake(localStorageSpy.setItem);
    spyOn(localStorage, 'removeItem').and.callFake(localStorageSpy.removeItem);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login successfully', () => {
    // Arrange
    const email = 'test@example.com';
    const password = 'password';
    
    // Act
    let result: boolean | undefined;
    service.login(email, password).subscribe(res => {
      result = res;
    });
    
    // Assert - HTTP request
    const req = httpMock.expectOne('/api/auth/login');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ email, password });
    
    // Respond with mock data
    req.flush({ user: mockUser, token: mockToken });
    
    // Assert - result and state
    expect(result).toBeTrue();
    expect(service.user()).toEqual(mockUser);
    expect(service.isAuthenticated()).toBeTrue();
    expect(localStorage.setItem).toHaveBeenCalledWith('token', mockToken);
  });

  it('should handle login failure', () => {
    // Arrange
    const email = 'test@example.com';
    const password = 'wrong-password';
    
    // Act
    let result: boolean | undefined;
    service.login(email, password).subscribe(res => {
      result = res;
    });
    
    // Assert - HTTP request
    const req = httpMock.expectOne('/api/auth/login');
    
    // Respond with error
    req.flush('Invalid credentials', { status: 401, statusText: 'Unauthorized' });
    
    // Assert - result and state
    expect(result).toBeFalse();
    expect(service.user()).toBeNull();
    expect(service.isAuthenticated()).toBeFalse();
    expect(localStorage.removeItem).toHaveBeenCalledWith('token');
  });

  it('should logout correctly', () => {
    // Act
    service.logout();
    
    // Assert
    expect(service.user()).toBeNull();
    expect(service.isAuthenticated()).toBeFalse();
    expect(localStorage.removeItem).toHaveBeenCalledWith('token');
  });

  it('should check auth status with valid token', () => {
    // Arrange
    localStorageSpy.getItem.and.returnValue(mockToken);
    
    // Act
    let result: boolean | undefined;
    service.checkAuthStatus().subscribe(res => {
      result = res;
    });
    
    // Assert - HTTP request
    const req = httpMock.expectOne('/api/auth/me');
    expect(req.request.method).toBe('GET');
    
    // Respond with mock data
    req.flush(mockUser);
    
    // Assert - result and state
    expect(result).toBeTrue();
    expect(service.user()).toEqual(mockUser);
    expect(service.isAuthenticated()).toBeTrue();
  });

  it('should handle auth status check with invalid token', () => {
    // Arrange
    localStorageSpy.getItem.and.returnValue(mockToken);
    
    // Act
    let result: boolean | undefined;
    service.checkAuthStatus().subscribe(res => {
      result = res;
    });
    
    // Assert - HTTP request
    const req = httpMock.expectOne('/api/auth/me');
    
    // Respond with error
    req.flush('Invalid token', { status: 401, statusText: 'Unauthorized' });
    
    // Assert - result and state
    expect(result).toBeFalse();
    expect(service.user()).toBeNull();
    expect(service.isAuthenticated()).toBeFalse();
    expect(localStorage.removeItem).toHaveBeenCalledWith('token');
  });

  it('should handle auth status check with no token', () => {
    // Arrange
    localStorageSpy.getItem.and.returnValue(null);
    
    // Act
    let result: boolean | undefined;
    service.checkAuthStatus().subscribe(res => {
      result = res;
    });
    
    // Assert - no HTTP request
    httpMock.expectNone('/api/auth/me');
    
    // Assert - result and state
    expect(result).toBeFalse();
    expect(service.user()).toBeNull();
    expect(service.isAuthenticated()).toBeFalse();
  });
});
