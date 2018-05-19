import {Component, OnInit} from '@angular/core';
import {SocketService} from './services/move-comms.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  gameStatus = 'idle';
  gameResult = null;
  colorAssigned: string;
  idAssigned: number;

  constructor(private socket: SocketService) {

  }

  ngOnInit() {
    this.socket.messages.subscribe(msg => {
      this.handleMessage(msg);
    });
  }

  private handleMessage(message) {
    console.log(message);
    if (message.type === 'waiting') {
      this.gameStatus = message.type;
    } else if (message.type === 'gameStart') {
      this.colorAssigned = message.data.color;
      this.idAssigned = message.data.gameId;
      this.gameStatus = message.type;

    }
  }


  findGame() {
    this.gameStatus = 'waiting';
    this.gameResult = null;
    this.socket.sendMsg({
      type: 'connect'
    });
  }

  displayResults(winner) {
    if (winner) {
      this.gameResult = 'win';
    } else {
      this.gameResult = 'lose';
    }
  }
}
