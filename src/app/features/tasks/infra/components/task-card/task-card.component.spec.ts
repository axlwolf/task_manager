import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TaskCardComponent } from './task-card.component';
import { TasksStoreService } from '../../services/tasks-store.service';
import { AnimationService } from '../../../../../shared/services/animation.service';
import { Task } from '../../../domain/models/task.model';
import { DatePipe } from '@angular/common';
import { AnimationFactory, AnimationPlayer } from '@angular/animations';
import { IconComponent } from '../../../../../shared/components/icon/icon.component';
import { ButtonComponent } from '../button/button.component';
import { PulseDirective } from '../../../../../shared/directives/pulse.directive';
import { HighlightDirective } from '../../../../../shared/directives/highlight.directive';

describe('TaskCardComponent', () => {
  let component: TaskCardComponent;
  let fixture: ComponentFixture<TaskCardComponent>;
  let tasksStore: jasmine.SpyObj<TasksStoreService>;
  let animationService: jasmine.SpyObj<AnimationService>;
  let animationFactory: jasmine.SpyObj<AnimationFactory>;
  let animationPlayer: jasmine.SpyObj<AnimationPlayer>;

  const mockTask: Task = {
    id: 'task1',
    title: 'Test Task',
    description: 'Test Description',
    dueDate: new Date('2023-12-31'),
    userId: 'user1',
    completed: false
  };

  const mockCompletedTask: Task = {
    ...mockTask,
    completed: true
  };

  beforeEach(async () => {
    // Create spies
    animationPlayer = jasmine.createSpyObj('AnimationPlayer', ['play']);
    animationFactory = jasmine.createSpyObj('AnimationFactory', ['create']);
    animationFactory.create.and.returnValue(animationPlayer);
    
    animationService = jasmine.createSpyObj('AnimationService', [
      'createHighlightAnimation',
      'createRotateAnimation',
      'createShakeAnimation',
      'playAnimation'
    ]);
    animationService.createHighlightAnimation.and.returnValue(animationFactory);
    animationService.createRotateAnimation.and.returnValue(animationFactory);
    animationService.createShakeAnimation.and.returnValue(animationFactory);
    
    tasksStore = jasmine.createSpyObj('TasksStoreService', ['completeTask']);

    await TestBed.configureTestingModule({
      imports: [
        TaskCardComponent,
        DatePipe,
        IconComponent,
        ButtonComponent,
        PulseDirective,
        HighlightDirective
      ],
      providers: [
        { provide: TasksStoreService, useValue: tasksStore },
        { provide: AnimationService, useValue: animationService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskCardComponent);
    component = fixture.componentInstance;
    component.task = mockTask;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display task title', () => {
    const titleElement = fixture.debugElement.query(By.css('.task-title'));
    expect(titleElement.nativeElement.textContent.trim()).toBe(mockTask.title);
  });

  it('should display task description', () => {
    const descriptionElement = fixture.debugElement.query(By.css('.task-description'));
    expect(descriptionElement.nativeElement.textContent.trim()).toBe(mockTask.description);
  });

  it('should display formatted due date', () => {
    const datePipe = new DatePipe('en-US');
    const formattedDate = datePipe.transform(mockTask.dueDate, 'MMM d, yyyy');
    
    const dateElement = fixture.debugElement.query(By.css('.task-date'));
    expect(dateElement.nativeElement.textContent.trim()).toContain(formattedDate);
  });

  it('should display "Active" status for incomplete tasks', () => {
    const statusElement = fixture.debugElement.query(By.css('.task-status-badge'));
    expect(statusElement.nativeElement.textContent.trim()).toBe('Active');
    expect(statusElement.nativeElement.classList).toContain('task-status-badge-active');
  });

  it('should display "Completed" status for completed tasks', () => {
    // Update task to completed
    component.task = mockCompletedTask;
    fixture.detectChanges();
    
    const statusElement = fixture.debugElement.query(By.css('.task-status-badge'));
    expect(statusElement.nativeElement.textContent.trim()).toBe('Completed');
    expect(statusElement.nativeElement.classList).toContain('task-status-badge-completed');
  });

  it('should have enabled Complete button for incomplete tasks', () => {
    const button = fixture.debugElement.query(By.css('app-button'));
    expect(button.nativeElement.getAttribute('ng-reflect-disabled')).toBe('false');
  });

  it('should have disabled Complete button for completed tasks', () => {
    // Update task to completed
    component.task = mockCompletedTask;
    fixture.detectChanges();
    
    const button = fixture.debugElement.query(By.css('app-button'));
    expect(button.nativeElement.getAttribute('ng-reflect-disabled')).toBe('true');
  });

  it('should call tasksStore.completeTask when Complete button is clicked', () => {
    const button = fixture.debugElement.query(By.css('app-button'));
    button.triggerEventHandler('buttonClick', null);
    
    expect(tasksStore.completeTask).toHaveBeenCalledWith(mockTask.id);
  });

  it('should play highlight animation when task is completed', () => {
    const button = fixture.debugElement.query(By.css('app-button'));
    button.triggerEventHandler('buttonClick', null);
    
    expect(animationService.createHighlightAnimation).toHaveBeenCalled();
    expect(animationService.playAnimation).toHaveBeenCalled();
  });
});
