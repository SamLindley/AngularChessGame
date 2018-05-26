import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {HttpHeaders} from '@angular/common/http';

@Injectable()
export class HttpService {

  testUrl = 'http://localhost:4000/test';
  registerUrl = 'http://localhost:4000/register';
  loginUrl = 'http://localhost:4000/login';

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) { }

  test() {
    return this.http.get(this.testUrl);
  }

  register(user) {
    return this.http.post(
      this.registerUrl, user, this.httpOptions
    );
  }

  logIn(user) {
    return this.http.post(this.loginUrl, user, this.httpOptions);
  }

}
