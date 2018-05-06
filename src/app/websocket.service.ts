import {Injectable} from '@angular/core';
import * as io from 'socket.io-client';
import {Observable} from 'rxjs/Observable';
import * as Rx from 'rxjs/Rx';

@Injectable()
export class WebsocketService {

  private socket;
  url = 'http://localhost:4000';

  constructor() {
  }

  connect(): Rx.Subject<MessageEvent> {
    this.socket = io(this.url);

    const observable = new Observable(observer => {
      this.socket.on('message', data => {
        console.log('received message from server');
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });

    const observer = {
      next: (data: Object) => {
        this.socket.emit('message', JSON.stringify(data));
      }
    };

    return Rx.Subject.create(observer, observable);
  }

}
