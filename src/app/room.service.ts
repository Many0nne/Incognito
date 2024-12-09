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

  joinRoom(username: string, pseudo: string, room: string) {
    this.socket.emit('joinRoom', { username, pseudo, room });
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

  startGame(room: string) {
    this.socket.emit('startGame', { room });
  }

  onGameStarted(callback: () => void) {
    this.socket.on('gameStarted', callback);
  }

  sendQuestion(room: string, question: string) {
    this.socket.emit('sendQuestion', { room, question });
  }

  onReceiveQuestion(callback: (question: string) => void) {
    this.socket.on('receiveQuestion', callback);
  }

  onNextQuestion(callback: () => void) {
    this.socket.on('nextQuestion', callback);
  }

  endGame(room: string) {
    this.socket.emit('endGame', { room });
  }

  onGameEnded(callback: (data: { players: any[] }) => void) {
    this.socket.on('gameEnded', callback);
  }

}
