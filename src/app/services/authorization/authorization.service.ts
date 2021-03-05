import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { User } from 'src/app/models/authorization/user.model';
import { LocalstorageService } from '../global/localstorage.service';
import { Router } from '@angular/router';
import * as jwt_decode from 'jwt-decode';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthorizationService {
  public currentUser: Observable<User>;
  private currentUserSubject: BehaviorSubject<User>;
  baseUrl = environment.apiUrl;
  headers = new HttpHeaders().set('content-type', 'application/json');

  constructor(
    private http: HttpClient,
    private router: Router,
    private localStorageService: LocalstorageService
  ) {
    let token = this.localStorageService.getLocalStorage('tokenStandardCan');
    if (token && token != 'null') {
      const decodeToken = jwt_decode(token);
      if (decodeToken) {
        if (Date.now() > decodeToken.exp * 1000) {
          token = null;
          this.currentUserSubject = new BehaviorSubject<User>(null);
          this.Logout();
        } else {
          this.currentUserSubject = new BehaviorSubject<User>(decodeToken);
        }
      } else {
        this.currentUserSubject = new BehaviorSubject<User>(null);
      }
    } else {
      this.currentUserSubject = new BehaviorSubject<User>(null);
    }
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  Login(userName: string, password: string) {
    return this.http.post<any>(`${environment.apiUrl}api/Authentication`,
      {
        UserName: userName,
        Password: password
      })
      .pipe(map(
        (user) => {
          if (user) {
            if (user.message.status == '1') {
              this.localStorageService.setLocalStorage('tokenStandardCan', JSON.stringify(user.token_login));
              const decodeToken = jwt_decode(user.token_login);
              if (decodeToken) {
                if (Date.now() > decodeToken.exp * 1000) {
                  user.token_login = null;
                  this.currentUserSubject = new BehaviorSubject<User>(null);
                  this.Logout();
                } else {
                  this.currentUserSubject = new BehaviorSubject<User>(decodeToken);
                }
              }
            }
          }
          this.currentUser = this.currentUserSubject.asObservable();
          return this.currentUser;
        },
        (err) => {

        }));
  }

  
  LoginToken2(token: string) {
    return this.http.post<any>(`${environment.apiUrl}api/Authentication`,
      {
        Token: token,
      })
      .pipe(map(
        (user) => {
          if (user) {
            if (user.message.status == '1') {
              this.localStorageService.setLocalStorage('tokenStandardCan', JSON.stringify(user.token_login));
              const decodeToken = jwt_decode(user.token_login);
              if (decodeToken) {
                if (Date.now() > decodeToken.exp * 1000) {
                  user.token_login = null;
                  this.currentUserSubject = new BehaviorSubject<User>(null);
                  this.Logout();
                } else {
                  this.currentUserSubject = new BehaviorSubject<User>(decodeToken);
                }
              }
            }
          }
          this.currentUser = this.currentUserSubject.asObservable();
          return this.currentUser;
        },
        (err) => {

        }));
  }

  LoginToken(token_login: string) {
    this.localStorageService.setLocalStorage('tokenStandardCan', JSON.stringify(token_login));
    const decodeToken = jwt_decode(token_login);
    if (decodeToken) {
      if (Date.now() > decodeToken.exp * 1000) {
        // user.token_login = null;
        this.currentUserSubject = new BehaviorSubject<User>(null);
        // this.Logout();
      } else {
        this.currentUserSubject = new BehaviorSubject<User>(decodeToken);

      }
    }

    this.currentUser = this.currentUserSubject.asObservable();
    console.log("xxx");
    alert(JSON.stringify(this.currentUserSubject.value));
    console.log(this.currentUserSubject.value);

    return this.currentUser;
  }

  Logout() {
    this.localStorageService.removeItem('tokenStandardCan');
    this.localStorageService.removeItem('roleStandardCan');
    this.localStorageService.clearLocalStorage();
    this.currentUserSubject = new BehaviorSubject<User>(null);
  }


}
