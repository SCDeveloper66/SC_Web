import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  baseUrl = environment.apiUrl;
  headers = new HttpHeaders().set('content-type', 'application/json');
  constructor(
    private http: HttpClient,
  ) { }

  GetMasterDDL(body: any) {
    return this.http.post<any>(this.baseUrl + 'api/employee', body);
  }

  ApiEmployee(body: any) {
    return this.http.post<any>(this.baseUrl + 'api/employee', body);
  }

}
