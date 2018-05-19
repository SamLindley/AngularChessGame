import { Component, OnInit } from '@angular/core';
import {LoginService} from '../services/login.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private loginService: LoginService) { }

  ngOnInit() {
  }

  logIn() {
    this.loginService.login();
    console.log(this.loginService.loginStatus());
  }

  logOut() {
    this.loginService.logout();
    console.log(this.loginService.loginStatus());
  }

  checkStatus() {
    console.log(this.loginService.loginStatus());
  }
}
