import { FormControl } from '@angular/forms';

export interface TaskFormValue {
    title: string;
    description: string;
    status: 'TODO' | 'IN_PROGRESS' | 'DONE';
    priority: number;
}

export interface TaskFormGroup {
    title: FormControl<string>;
    description: FormControl<string>;
    status: FormControl<'TODO' | 'IN_PROGRESS' | 'DONE'>;
    priority: FormControl<number>;
}

export interface TaskDialogData {
    task: Task;
}



export interface Task {
    id: string;
    title: string;
    description?: string;
    status: 'TODO' | 'IN_PROGRESS' | 'DONE';
    priority: number;
    dueDate?: string;
    category?: string;
    userId: string;
}