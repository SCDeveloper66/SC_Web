import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BookingcarService {
  baseUrl = environment.apiUrl;
  headers = new HttpHeaders().set('content-type', 'application/json');
  constructor(
    private http: HttpClient,
  ) { }

  ApiMasActivity(body: any) { 
    return this.http.post<any>(this.baseUrl + 'api/activity', body);
  }
  
  ApiCartype(body: any) {
    return this.http.post<any>(this.baseUrl + 'api/cartype', body);
  }

  ApiCar(body: any) {
    return this.http.post<any>(this.baseUrl + 'api/car', body);
  }

  ApiCarReason(body: any) {
    return this.http.post<any>(this.baseUrl + 'api/carReason', body);
  }

  ApiBookingCar(body: any) {
    return this.http.post<any>(this.baseUrl + 'api/bookcar', body);
  }

  ApiBookCarSubmit(body: any) {
    return this.http.post<any>(this.baseUrl + 'api/bookCarSubmit', body);
  }

  ApiDestination(body: any) {
    return this.http.post<any>(this.baseUrl + 'api/destination', body);
  }

}
