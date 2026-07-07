import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaterialModule } from '../../../material.module';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TaskDialogData, TaskFormGroup } from '../../../core/interfaces/task-form.interface';
import { TasksService } from '../../../services/tasks-service';

@Component({
  selector: 'app-task-dialog-component',
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  templateUrl: './task-dialog-component.html',
  styleUrl: './task-dialog-component.scss',
})
export class TaskDialogComponent {
  private fb = inject(FormBuilder);
  private taskService = inject(TasksService);
  private dialogRef = inject(MatDialogRef<TaskDialogComponent>);
  data = inject<TaskDialogData>(MAT_DIALOG_DATA);

  isSaving = signal(false);
  isDeleting = signal(false);

  statusOptions: Array<'TODO' | 'IN_PROGRESS' | 'DONE'> = ['TODO', 'IN_PROGRESS', 'DONE'];

  form = this.fb.nonNullable.group<TaskFormGroup>({
    title: this.fb.nonNullable.control(this.data.task.title, Validators.required),
    description: this.fb.nonNullable.control(this.data.task.description ?? ''),
    status: this.fb.nonNullable.control(this.data.task.status, Validators.required),
    priority: this.fb.nonNullable.control(this.data.task.priority, [
      Validators.required,
      Validators.min(1),
      Validators.max(5),
    ]),
  });

  save() {
    if (this.form.invalid) return;

    this.isSaving.set(true);
    this.taskService.update(this.data.task.id, this.form.getRawValue()).subscribe({
      next: (updated) => {
        this.isSaving.set(false);
        this.dialogRef.close({ action: 'updated', task: updated });
      },
      error: (err) => {
        console.error(err);
        this.isSaving.set(false);
      },
    });
  }

  delete() {
    if (!confirm('Сигурен ли си, че искаш да изтриеш тази задача?')) return;

    this.isDeleting.set(true);
    this.taskService.delete(this.data.task.id).subscribe({
      next: () => {
        this.isDeleting.set(false);
        this.dialogRef.close({ action: 'deleted', taskId: this.data.task.id });
      },
      error: (err) => {
        console.error(err);
        this.isDeleting.set(false);
      },
    });
  }


}
