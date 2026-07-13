import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Task, TaskService } from '../../services/task.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css'],
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  loading = false;
  errorMsg = '';

  // form state
  formTitle = '';
  formDescription = '';
  formStatus: Task['status'] = 'pending';
  editingId: string | null = null;

  constructor(
    private taskService: TaskService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchTasks();
  }

  get userName(): string {
    return this.authService.getUser()?.name || 'User';
  }

  fetchTasks(): void {
    this.loading = true;
    this.taskService.getTasks().subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg = err?.error?.message || 'Failed to load tasks.';
      },
    });
  }

  submitTask(): void {
    if (!this.formTitle.trim()) {
      this.errorMsg = 'Title is required.';
      return;
    }
    this.errorMsg = '';

    const payload = {
      title: this.formTitle,
      description: this.formDescription,
      status: this.formStatus,
    };

    if (this.editingId) {
      this.taskService.updateTask(this.editingId, payload).subscribe({
        next: () => {
          this.resetForm();
          this.fetchTasks();
        },
        error: (err) => (this.errorMsg = err?.error?.message || 'Failed to update task.'),
      });
    } else {
      this.taskService.createTask(payload).subscribe({
        next: () => {
          this.resetForm();
          this.fetchTasks();
        },
        error: (err) => (this.errorMsg = err?.error?.message || 'Failed to create task.'),
      });
    }
  }

  editTask(task: Task): void {
    this.editingId = task._id || null;
    this.formTitle = task.title;
    this.formDescription = task.description || '';
    this.formStatus = task.status;
  }

  deleteTask(id: string | undefined): void {
    if (!id) return;
    if (!confirm('Delete this task?')) return;

    this.taskService.deleteTask(id).subscribe({
      next: () => this.fetchTasks(),
      error: (err) => (this.errorMsg = err?.error?.message || 'Failed to delete task.'),
    });
  }

  resetForm(): void {
    this.editingId = null;
    this.formTitle = '';
    this.formDescription = '';
    this.formStatus = 'pending';
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
