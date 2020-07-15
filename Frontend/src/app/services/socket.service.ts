import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as io from 'socket.io-client';

import { environment } from '../../environments/environment';
import { Command } from '../models/Command';

const SERVER_URL = environment.socketUrl;

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket;

  constructor() {
    this.socket = io(SERVER_URL);
  }

  joinRoom(roomId: string) {
    this.socket.emit('joinRoom', roomId);
  }

  sendCommandToRoom(roomId: string, command: Command) {
    this.socket.emit('sendCommandToRoom', roomId, command);
  }

  onCommand(): Observable<Command> {
    return new Observable<Command>((observer) => {
      this.socket.on('command', (data: Command) => {
        observer.next(data);
      });
    });
  }
}
