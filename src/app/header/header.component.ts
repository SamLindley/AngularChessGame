import { Component, OnInit } from '@angular/core';
import {LoginService} from '../services/login.service';
import {HttpService} from '../services/http.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  user;

  constructor(private loginService: LoginService, private http: HttpService) { }

  ngOnInit() {
  }

  logIn(email, password) {
    this.http.logIn({
      user: {
        email: email,
        password: password
      }
    }).subscribe(data => {
      console.log(data);
      this.loginService.login(data);
      this.user = data;
    });

  }

  logOut() {
    this.loginService.logout();
  }

  checkStatus() {
    return this.loginService.loginStatus();
  }
}
