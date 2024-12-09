import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-lobby',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './lobby.component.html',
  styleUrl: './lobby.component.css'
})
export class LobbyComponent {

  username = '';
  room = '';

  constructor(private router: Router) {}

  joinRoom() {
    if (this.username && this.room) {
      this.router.navigate(['/room', this.room], {
        queryParams: { username: this.username },
      });
    }
  }
}
