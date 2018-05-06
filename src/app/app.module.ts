import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {WebsocketService} from './websocket.service';
import {ChatService} from './chat.service';
import {SocketService} from './move-comms.service';

import { AppComponent } from './app.component';
import { ChessBoardComponent } from './chess-board/chess-board.component';
import { SquareComponent } from './chess-board/square/square.component';
import { LobbyScreenComponent } from './lobby-screen/lobby-screen.component';
import { HeaderComponent } from './header/header.component';

@NgModule({
  declarations: [
    AppComponent,
    ChessBoardComponent,
    SquareComponent,
    LobbyScreenComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [
    WebsocketService,
    SocketService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

}
