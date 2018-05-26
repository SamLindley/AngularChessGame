import { Injectable } from '@angular/core';

@Injectable()
export class LoginService {

  loggedIn;
  user;

  constructor() {
    this.loggedIn = false;
  }

  login(user) {
    this.loggedIn = true;
    this.user = user;
  }

  logout() {
    this.loggedIn = false;
    this.user = null;
  }

  loginStatus() {
    return this.loggedIn;
  }

  getUser() {
    return this.user;
  }

}
