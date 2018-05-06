import { Injectable } from '@angular/core';
import {WebsocketService} from './websocket.service';
import {Observable, Subject} from 'rxjs/Rx';

@Injectable()
export class SocketService {

  messages: Subject<any>;

  constructor(private wsService: WebsocketService) {
    this.messages = <Subject<any>>wsService
      .connect()
      .map((response: any): any => {
        return response;
      });
  }

  public sendMsg(msg) {
    this.messages.next(msg);
  }

}
