import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RoomService } from '../room.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-room',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css'],
})
export class RoomComponent implements OnInit {
  username = '';
  room = '';
  players: any[] = [];
  messages: { sender: string; text: string }[] = [];
  newMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private roomService: RoomService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.username = params['username'];
      this.room = this.route.snapshot.params['room'];
      this.roomService.joinRoom(this.username, this.room);

      this.roomService.onUpdatePlayers((players) => {
        this.players = players;
      });

      // Recevoir les messages
      this.roomService.onReceiveMessage((message) => {
        this.messages.push(message);
      });
    });

    
  }



  sendMessage() {
    if (this.newMessage.trim()) {
      this.roomService.sendMessage(this.room, this.username, this.newMessage);
      this.newMessage = '';
    }
  }

  
}
