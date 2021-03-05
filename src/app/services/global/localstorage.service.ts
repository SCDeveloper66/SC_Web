import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalstorageService {
  // token = 'tokenStandardCan';
  // role = 'roleEmQAdmin';
  constructor() { }
  getLocalStorage(key) {
    return localStorage.getItem(key);
  }

  setLocalStorage(key, value) {
    return localStorage.setItem(key, value);
  }

  // getRole() {
  //   return localStorage.getItem(this.role);
  // }

  // getToken() {
  //   return localStorage.getItem(this.token);
  // }

  // setRole(value) {
  //   return localStorage.setItem(this.role, value);
  // }

  removeItem(key) {
    return localStorage.removeItem(key);
  }

  clearLocalStorage() {
    localStorage.clear();
  }
}
