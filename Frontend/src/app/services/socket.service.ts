import { Injectable } from '@angular/core';
import { Command } from '../models/Command';
import { Observable } from 'rxjs';
import * as io from 'socket.io-client';

// TODO -> put url in environment file
const SERVER_URL = 'http://localhost:8000'

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket;

  initSocket(){
    this.socket = io(SERVER_URL);
  }

  joinRoom(roomId: string){
    this.socket.emit('joinRoom', roomId)
  }

  sendCommandToRoom(command: Command){
    const value = { room: command.roomId,  action: command.action, value: command.value}
    this.socket.emit('sendCommandToRoom', value)
  }

  onCommand(): Observable<Command> {
    return new Observable<Command>(observer => {
        this.socket.on('command', (data: Command) => observer.next(data));
    });
  }
}
