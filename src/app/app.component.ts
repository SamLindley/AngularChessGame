import {Component, OnInit} from '@angular/core';
import {SocketService} from './services/move-comms.service';
import {HttpService} from './services/http.service';
import {LoginService} from './services/login.service';

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
  opponent: string;

  constructor(
    private socket: SocketService,
    private http: HttpService,
    private login: LoginService
  ) {

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
      console.log(message.data);
      this.opponent = message.data.opponent.email;
      this.colorAssigned = message.data.color;
      this.idAssigned = message.data.gameId;
      this.gameStatus = message.type;
      console.log(message.data);
    }
  }


  findGame() {
    console.log(this.login.loginStatus());
    this.gameStatus = 'waiting';
    this.gameResult = null;
    this.socket.sendMsg({
      type: 'connect',
      user: this.login.getUser()
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
