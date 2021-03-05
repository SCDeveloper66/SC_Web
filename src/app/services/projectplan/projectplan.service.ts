import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProjectplanService {

  baseUrl = environment.apiUrl;
  headers = new HttpHeaders().set('content-type', 'application/json');

  constructor(
    private http: HttpClient,
  ) { }

  ApiExpert(body: any) {
    return this.http.post<any>(this.baseUrl + 'api/expert', body);
  }

  ApiExpense(body: any) {
    return this.http.post<any>(this.baseUrl + 'api/expense', body);
  }

  ApiTrainDestination(body: any) {
    return this.http.post<any>(this.baseUrl + 'api/traindestination', body);
  }

  ApiReportSetting(body: any) {
    return this.http.post<any>(this.baseUrl + 'api/reportSetting', body);
  }

  ApiProject(body: any) {
    return this.http.post<any>(this.baseUrl + 'api/project', body);
  }

  ApiProjectCourse(body: any) {
    return this.http.post<any>(this.baseUrl + 'api/projectCourse', body);
  }

  ApiProjectFormular(body: any) {
    return this.http.post<any>(this.baseUrl + 'api/projectFormular', body);
  }

  ApiProjectTrainingSchedule(body: any) {
    return this.http.post<any>(this.baseUrl + 'api/projectTrainingSchedule', body);
  }

}
