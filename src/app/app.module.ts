import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {WebsocketService} from './services/websocket.service';
import {ChatService} from './services/chat.service';
import {SocketService} from './services/move-comms.service';
import {HttpClientModule} from '@angular/common/http';
import { AppComponent } from './app.component';
import { ChessBoardComponent } from './chess-board/chess-board.component';
import { SquareComponent } from './chess-board/square/square.component';
import { LobbyScreenComponent } from './lobby-screen/lobby-screen.component';
import { HeaderComponent } from './header/header.component';
import {LoginService} from './services/login.service';
import {HttpService} from './services/http.service';

@NgModule({
  declarations: [
    AppComponent,
    ChessBoardComponent,
    SquareComponent,
    LobbyScreenComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [
    WebsocketService,
    SocketService,
    LoginService,
    HttpService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

}
