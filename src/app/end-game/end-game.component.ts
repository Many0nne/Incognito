import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-end-game',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './end-game.component.html',
  styleUrl: './end-game.component.css'
})

export class EndGameComponent implements OnInit {
  players: any[] = [];

  constructor(private router: Router) {}

  ngOnInit(): void {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.players = navigation.extras.state['players'];
    }
    console.log(this.players); // Vérifiez si les joueurs sont correctement récupérés
  }
}