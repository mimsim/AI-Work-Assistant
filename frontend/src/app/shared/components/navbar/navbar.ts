import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MaterialModule } from '../../../material.module';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, MaterialModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  userName = 'Demo User';

  get userInitials(): string {
    return this.userName
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }
}
