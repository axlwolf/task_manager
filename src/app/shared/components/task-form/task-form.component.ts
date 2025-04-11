import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent],
  template: `
    <div class="bg-white rounded-lg p-6 shadow-lg">
      <h2 class="text-xl font-bold text-purple-900 mb-4">{{ isEditing ? 'Edit Task' : 'Add New Task' }}</h2>
      
      <form [formGroup]="taskForm" (ngSubmit)="onSubmit()">
        <div class="mb-4">
          <label for="title" class="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input 
            type="text" 
            id="title" 
            formControlName="title"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Enter task title"
          >
          @if (taskForm.get('title')?.invalid && taskForm.get('title')?.touched) {
            <p class="mt-1 text-sm text-red-600">Title is required</p>
          }
        </div>
        
        <div class="mb-4">
          <label for="description" class="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea 
            id="description" 
            formControlName="description"
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Enter task description"
          ></textarea>
          @if (taskForm.get('description')?.invalid && taskForm.get('description')?.touched) {
            <p class="mt-1 text-sm text-red-600">Description is required</p>
          }
        </div>
        
        <div class="mb-6">
          <label for="dueDate" class="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
          <input 
            type="date" 
            id="dueDate" 
            formControlName="dueDate"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
          @if (taskForm.get('dueDate')?.invalid && taskForm.get('dueDate')?.touched) {
            <p class="mt-1 text-sm text-red-600">Due date is required</p>
          }
        </div>
        
        <div class="flex justify-end space-x-3">
          <app-button 
            variant="secondary" 
            type="button"
            (buttonClick)="onCancel()"
          >
            Cancel
          </app-button>
          <app-button 
            variant="primary" 
            type="submit"
            [disabled]="taskForm.invalid"
          >
            {{ isEditing ? 'Update' : 'Add' }} Task
          </app-button>
        </div>
      </form>
    </div>
  `,
  styles: []
})
export class TaskFormComponent {
  @Input() isEditing = false;
  @Input() userId = '';
  
  @Output() save = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();
  
  taskForm: FormGroup;
  
  constructor(private fb: FormBuilder) {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      dueDate: ['', Validators.required]
    });
  }
  
  onSubmit(): void {
    if (this.taskForm.valid) {
      this.save.emit({
        ...this.taskForm.value,
        userId: this.userId
      });
    }
  }
  
  onCancel(): void {
    this.cancel.emit();
  }
}