import {Component, OnInit} from '@angular/core';
import {SocketService} from './move-comms.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  gameStatus = 'idle';

  constructor(private socket: SocketService) {

  }

  ngOnInit() {
    this.socket.messages.subscribe(msg => {
      this.handleMessage(msg);
    });
  }

  private handleMessage(message) {
    console.log(message);
    if (message.type === 'waiting' || message.type === 'gameStart') {
      this.gameStatus = message.type;
    }
  }


  findGame() {
    this.socket.sendMsg({
      type: 'connect'
    });
  }
}
