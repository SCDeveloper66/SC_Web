import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { LocalstorageService } from '../global/localstorage.service';

@Injectable({
  providedIn: 'root'
})
export class UserRoleService {
  baseUrl = environment.apiUrl;
  headers = new HttpHeaders().set('content-type', 'application/json');
  constructor(
    private http: HttpClient,
    private router: Router,
    private localStorageService: LocalstorageService
  ) { }

  ApiUserRole(body: any) {
    return this.http.post<any>(this.baseUrl + 'api/userRole', body);
  }

  ApiLanguage(body: any) {
    return this.http.post<any>(this.baseUrl + 'api/languageSetting', body);
  }

}
