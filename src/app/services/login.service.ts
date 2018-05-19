import { Injectable } from '@angular/core';

@Injectable()
export class LoginService {

  loggedIn;

  constructor() {
    this.loggedIn = false;
  }

  login() {
    this.loggedIn = true;
  }

  logout() {
    this.loggedIn = false;
  }

  loginStatus() {
    return this.loggedIn;
  }

}
