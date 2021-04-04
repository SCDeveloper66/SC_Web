import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ApprovalService {
  baseUrl = environment.apiUrl;
  headers = new HttpHeaders().set('content-type', 'application/json');
  constructor(private http: HttpClient) {}

  ApiApproval(body: any) {
    return this.http.post<any>(this.baseUrl + 'api/approval', body);
  }

  //https://jsoft-thailand.com/SCBackendApi/api/empLeave/
}
