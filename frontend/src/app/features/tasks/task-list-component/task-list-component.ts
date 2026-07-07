import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MaterialModule } from '../../../material.module';
import { TaskDialogComponent } from '../task-dialog-component/task-dialog-component';
import { TasksService } from '../../../services/tasks-service';
import { Task } from '../../../core/interfaces/task-form.interface';

@Component({
  selector: 'app-task-list-component',
  imports: [CommonModule, MaterialModule],
  templateUrl: './task-list-component.html',
  styleUrls: ['./task-list-component.scss'],
})
export class TaskListComponent {
  private taskService = inject(TasksService);
  private dialog = inject(MatDialog);

  tasks = signal<Task[]>([]);
  isLoading = signal(false);

  // временно, докато няма реална автентикация
  userId = 'cmr8neeby0000vgog4uax7vdc';

  ngOnInit() {
    this.load();
  }

  load() {
    this.isLoading.set(true);
    this.taskService.getAll(this.userId).subscribe({
      next: (tasks) => {
        this.tasks.set(tasks);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.isLoading.set(false);
      },
    });
  }

  openTask(task: Task) {
    const dialogRef = this.dialog.open<TaskDialogComponent>(TaskDialogComponent, {
      data: { task, userId: this.userId },
      width: '480px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;

      if (result.action === 'updated') {
        this.tasks.update((tasks) =>
          tasks.map((t) => (t.id === result.task.id ? result.task : t)),
        );
      }

      if (result.action === 'deleted') {
        this.tasks.update((tasks) => tasks.filter((t) => t.id !== result.taskId));
      }
    });
  }

  createTask() {
    const dialogRef = this.dialog.open<TaskDialogComponent>(TaskDialogComponent, {
      data: { userId: this.userId },   // без task = create режим
      width: '480px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;
      if (result.action === 'created') {
        this.tasks.update((tasks) => [...tasks, result.task]);
      }
    });
  }
  
  statusColor(status: Task['status']): string {
    switch (status) {
      case 'DONE':
        return 'done';
      case 'IN_PROGRESS':
        return 'in-progress';
      default:
        return 'todo';
    }
  }
}
