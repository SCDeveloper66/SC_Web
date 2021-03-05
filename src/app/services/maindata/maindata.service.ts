import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { LocalstorageService } from '../global/localstorage.service';

@Injectable({
  providedIn: 'root'
})
export class MainDataService {
  baseUrl = environment.apiUrl;
  headers = new HttpHeaders().set('content-type', 'application/json');
  constructor(
    private http: HttpClient,
    private router: Router,
    private localStorageService: LocalstorageService
  ) { }

  ApiDepartment(body: any) {
    return this.http.post<any>(this.baseUrl + 'api/department', body);
  }

  ApiHoliday(body: any) {
    return this.http.post<any>(this.baseUrl + 'api/holiday', body);
  }

  ApiNode(body: any) {
    return this.http.post<any>(this.baseUrl + 'api/node', body);
  }

  ApiCheckInPermanent(body: any) {
    return this.http.post<any>(this.baseUrl + 'api/empCheckInRegular', body);
  }

  ApiCheckInTemporary(body: any) {
    return this.http.post<any>(this.baseUrl + 'api/empCheckInTemporary', body);
  }

  ApiNews(body: any) {
    // alert(JSON.stringify(body));
    return this.http.post<any>(this.baseUrl + 'api/news', body);
  }

  ApiBenefits(body: any) {
    return this.http.post<any>(this.baseUrl + 'api/benefits', body);
  }

  ApiImageSlide(body: any) {
    return this.http.post<any>(this.baseUrl + 'api/imageSlide', body);
  }

  UploadFile(formData: FormData, fileType, fileId, user_id) {
  
    fileId = fileId == null ? '' : fileId;
    return this.http.post<any>(this.baseUrl + 'api/ImportData', formData, {
      params: {
        fileType,
        fileId,
        user_id
      }
    });
  }

}
