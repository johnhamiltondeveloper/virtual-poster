import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {User} from './user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private httpClient: HttpClient) { }
  // tslint:disable-next-line:typedef
  onCreateUser(user: User): Observable<any>{
    return this.httpClient.post<any>('http://localhost:3000/auth/register', user );
  }
  onLoginUser(user: User): Observable<any>{
    return this.httpClient.post<any>('http://localhost:3000/auth/login', user);
  }
  // tslint:disable-next-line:typedef
  get getToken(){
    return localStorage.getItem('token');
  }
  // tslint:disable-next-line:typedef
  onLogout(){
    localStorage.removeItem('token');
    localStorage.removeItem('email');
  }
  // tslint:disable-next-line:typedef
  isLoggedIn(){
    if (localStorage.getItem('token')){
      return true;
    } else {
      return false;
    }
  }
  // tslint:disable-next-line:typedef
  currentUser(){
    return localStorage.getItem('email');
  }
}
