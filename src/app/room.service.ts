import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  private socket: Socket;

  constructor() {
    this.socket = io('http://localhost:3000');
  }

  joinRoom(username: string, room: string) {
    this.socket.emit('joinRoom', { username, room });
  }

  // Envoyer un message
  sendMessage(room: string, sender: string, text: string) {
    this.socket.emit('sendMessage', { room, sender, text });
  }

  // Recevoir les messages
  onReceiveMessage(callback: (message: { sender: string; text: string }) => void) {
    this.socket.on('receiveMessage', callback);
  }

  onUpdatePlayers(callback: (players: any[]) => void) {
    this.socket.on('updatePlayers', callback);
  }

}
