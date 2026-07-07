import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { ChatResponse } from '../core/interfaces/chat.interface';
import { Observable } from 'rxjs';

@Service()
export class ChatService {
    private apiUrl = 'http://localhost:3000/api/ai/chat';
    private http = inject(HttpClient);
   

    sendMessage(userId: string, message: string): Observable<ChatResponse> {
        return this.http.post<ChatResponse>(this.apiUrl, { userId, message });
    }
}
