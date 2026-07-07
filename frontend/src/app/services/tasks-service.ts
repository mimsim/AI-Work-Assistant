import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { Task } from '../core/interfaces/task-form.interface';

@Service()
export class TasksService {
    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:3000/api/tasks';

    getAll(userId: string): Observable<Task[]> {
        return this.http.get<Task[]>(this.apiUrl, { params: { userId } });
    }

    getOne(id: string): Observable<Task> {
        return this.http.get<Task>(`${this.apiUrl}/${id}`);
    }

    update(id: string, data: Partial<Task>): Observable<Task> {
        return this.http.put<Task>(`${this.apiUrl}/${id}`, data);
    }

    delete(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
    
    create(data: { title: string; description?: string; status: string; priority: number }): Observable<Task> {
        return this.http.post<Task>(this.apiUrl, data);
    }
}
