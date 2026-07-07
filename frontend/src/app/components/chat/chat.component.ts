import { Component, inject, signal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material.module';
import { ChatService } from '../../services/chat.service';
import { ChatMessage } from '../../core/interfaces/chat.interface';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule, CommonModule,
    ReactiveFormsModule, MaterialModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
})
export class ChatComponent {
  private chatService = inject(ChatService);

  messages = signal<ChatMessage[]>([]);
  isLoading = signal(false);

  messageControl = new FormControl('', { nonNullable: true, validators: [Validators.required] });
  private snackBar = inject(MatSnackBar);
  
  // временно, докато няма реална автентикация
  userId = 'cmr8neeby0000vgog4uax7vdc';

  send() {
    const text = this.messageControl.value.trim();
    if (!text || this.isLoading()) return;

    this.messages.update((msgs) => [...msgs, { role: 'user', content: text }]);
    this.messageControl.reset('');
    this.isLoading.set(true);

    this.chatService.sendMessage(this.userId, text).subscribe({
      next: (res) => {
        this.messages.update((msgs) => [
          ...msgs,
          { role: 'assistant', content: res.reply },
        ]);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.messages.update((msgs) => [
          ...msgs,
          { role: 'assistant', content: '⚠️ Грешка при връзка със сървъра.' },
        ]);
        this.snackBar.open('Грешка при връзка със сървъра', 'OK', {
          duration: 4000,
          panelClass: ['snackbar-error'],
        });
        this.isLoading.set(false);
      },
    });
  }

  onKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.send();
    }
  }
}