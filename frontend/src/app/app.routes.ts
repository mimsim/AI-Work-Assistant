import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'chat',
        loadComponent: () => import('./components/chat/chat.component').then((m) => m.ChatComponent),
    },
    {
        path: 'tasks',
        loadComponent: () => import('./features/tasks/task-list-component/task-list-component').then((m) => m.TaskListComponent),
    },
    { path: '', redirectTo: 'chat', pathMatch: 'full' },
    { path: '**', redirectTo: 'chat' },
];
