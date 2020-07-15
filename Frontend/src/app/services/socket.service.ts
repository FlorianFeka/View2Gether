import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as io from 'socket.io-client';

import { environment } from '../../environments/environment';
import { Command } from '../models/Command';
import { Info } from '../models/Info';

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

  getInfo() {
    this.socket.emit('getInfo');
    return new Observable<Info>((observer) => {
      this.socket.on('info', (data: Info) => {
        observer.next(data);
      });
    });
  }

  onGetInfo(roomId: string, info: Info) {
    return new Observable<Command>((observer) => {
      this.socket.on('command', (data: Command) => {
        observer.next(data);
      });
    });
  }

  onCommand(): Observable<Command> {
    return new Observable<Command>((observer) => {
      this.socket.on('command', (data: Command) => {
        observer.next(data);
      });
    });
  }
}
