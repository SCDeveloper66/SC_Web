import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MeetingroomService {
  baseUrl = environment.apiUrl;
  headers = new HttpHeaders().set('content-type', 'application/json');
  constructor(
    private http: HttpClient,
  ) { }

  ApiHardware(body: any) {
    return this.http.post<any>(this.baseUrl + 'api/hardware', body);
  }

  ApiRoom(body: any) {
    return this.http.post<any>(this.baseUrl + 'api/room', body);
  }

  ApiBookingRoomConfig(body: any) {
    return this.http.post<any>(this.baseUrl + 'api/book_room_config', body);
  }

  ApiConfigMeeting(body: any) {
    return this.http.post<any>(this.baseUrl + 'api/configmeeting', body);
  }

  ApiBookingRoom(body: any) {
    return this.http.post<any>(this.baseUrl + 'api/bookRoom', body);
  }

  ApiEmployee(body: any) {
    return this.http.post<any>(this.baseUrl + 'api/employee', body);
  }

  ApiBookingRoomSubmit(body: any) {
    return this.http.post<any>(this.baseUrl + 'api/bookRoomSubmit', body);
  }

  ApiQRCodeFile(body: any) {
    return this.http.post(this.baseUrl + 'api/qrCode', body, { responseType: 'blob'});
  }

  ApiBookingRoomFile(body: any) {
    return this.http.post(this.baseUrl + 'api/bookRoom', body, { responseType: 'blob'});
  }

}
