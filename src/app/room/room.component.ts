import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RoomService } from '../room.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-room',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css'],
})
export class RoomComponent implements OnInit {
  username = '';
  pseudo = '';
  room = '';
  players: any[] = [];
  messages: { sender: string; text: string }[] = [];
  newMessage: string = '';
  isHost = false;
  isgameStarted = false;
  questions: string[] = [];
  currentQuestionIndex = 0;
  isgameEnded = false;
  playerChoices: { [key: string]: string } = {}; // Ajoutez cette ligne
  userPoints: number = 0; // Ajoutez cette ligne
  showScores = false; // Ajoutez cette ligne
  hasAnswered = false; // Ajoutez cette ligne


  constructor(
    private route: ActivatedRoute,
    private roomService: RoomService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.username = params['username'];
      this.pseudo = params['pseudo'];
      this.room = this.route.snapshot.params['room'];
      this.roomService.joinRoom(this.username, this.pseudo, this.room);

      this.roomService.onUpdatePlayers((players) => {
        this.players = players;
        const currentPlayer = players.find(player => player.username === this.username);
        if (currentPlayer) {
          this.isHost = currentPlayer.isHost;
        }
      });

      // Recevoir les messages
      this.roomService.onReceiveMessage((message) => {
        this.messages.push(message);
      });

      // Recevoir une question
      this.roomService.onReceiveQuestion((question) => {
        this.messages.push({ sender: 'Question', text: question });
        this.hasAnswered = false; // Réinitialiser l'état de la réponse
      });

      // Recevoir l'événement de la prochaine question
      this.roomService.onNextQuestion(() => {
        if (this.isHost) {
          this.sendNextQuestion();
        }
      });

      // Recevoir l'état du jeu
      this.roomService.onGameStarted(() => {
        this.isgameStarted = true;
        this.loadQuestions(); // Chargez les questions lorsque le jeu commence
      });

      // Recevoir la fin du jeu
      this.roomService.onGameEnded((data) => {
        this.isgameEnded = true;
        this.players = data.players;
        // Introduction d'un délai pour afficher les scores
        setTimeout(() => {
          this.collectResults();
          this.showScores = true;
        }, 120000); // 2 minutes
      });
    });
    
  }

  sendMessage() {
    if (this.newMessage.trim()) {
      this.roomService.sendMessage(this.room, this.username, this.newMessage);
      this.newMessage = '';
      this.hasAnswered = true; // Définir l'état de la réponse
    }
  }

  startGame() {
    this.roomService.startGame(this.room);
    this.isgameStarted = true;
    this.loadQuestions(); // Chargez les questions lorsque le jeu commence
    if (this.isHost) {
      this.sendNextQuestion();
    }
  }

  loadQuestions() {
    // Logique pour charger les questions
    this.questions = [
      'What is the capital of France?',
      'What is 2 + 2?',
      'What is the largest mammal?',
      'What is the largest planet in our solar system?',
      'What is the largest ocean on Earth?'
    ];
  }

  sendNextQuestion() {
    if (this.currentQuestionIndex < this.questions.length) {
      const question = this.questions[this.currentQuestionIndex];
      this.roomService.sendQuestion(this.room, question);
      this.currentQuestionIndex++;
    } else {
      // Terminer le jeu et envoyer les informations des joueurs
      this.roomService.endGame(this.room);
    }
  }

  collectResults() {
    const results = this.players.map(player => ({
      pseudo: player.pseudo,
      choice: this.playerChoices[player.username] || 'No choice'
    }));

    // Calculer les points pour l'utilisateur connecté
    this.userPoints = 0;
    this.players.forEach(player => {
      const choice = this.playerChoices[player.username];
      const correctPlayer = this.players.find(p => p.username === choice);
      if (correctPlayer && correctPlayer.pseudo === player.pseudo) {
        this.userPoints++;
      }
    });

    console.log(results); // Affichez les résultats dans la console
    console.log(this.userPoints); // Affichez les points des joueurs dans la console
  }
  
}
