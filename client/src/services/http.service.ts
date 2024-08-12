import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment.development';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  public serverName = environment.apiUrl;

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.authService.getToken()}`
    });
  }

  getBookingDetails(studentId: any): Observable<any> {
    return this.http.get(`${this.serverName}/api/student/registration-status/${studentId}`, { headers: this.getHeaders() });
  }

  registerForEvent(eventId: any, details: any): Observable<any> {
    return this.http.post(`${this.serverName}/api/student/register/${eventId}`, details, { headers: this.getHeaders() });
  }

  getAllEventAgenda(): Observable<any> {
    return this.http.get(`${this.serverName}/api/events/agenda`, { headers: this.getHeaders() });
  }

  GetAllevents(): Observable<any> {
    return this.http.get(`${this.serverName}/api/institution/events`, { headers: this.getHeaders() });
  }

  GetAllResources(): Observable<any> {
    return this.http.get(`${this.serverName}/api/institution/resources`, { headers: this.getHeaders() });
  }

  createEvent(details: any): Observable<any> {
    return this.http.post(`${this.serverName}/api/institution/event`, details, { headers: this.getHeaders() });
  }

  updateEvent(details: any, eventId: any): Observable<any> {
    return this.http.put(`${this.serverName}/api/educator/update-material/${eventId}`, details, { headers: this.getHeaders() });
  }

  addResource(details: any): Observable<any> {
    return this.http.post(`${this.serverName}/api/institution/resource`, details, { headers: this.getHeaders() });
  }

  allocateResources(eventId: any, resourceId: any, details: any): Observable<any> {
    return this.http.post(`${this.serverName}/api/institution/event/allocate-resources?eventId=${eventId}&resourceId=${resourceId}`, details, { headers: this.getHeaders() });
  }

  Login(details: any): Observable<any> {
    return this.http.post(`${this.serverName}/api/user/login`, details, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) });
  }

  registerUser(details: any): Observable<any> {
    return this.http.post(`${this.serverName}/api/user/register`, details, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) });
  }
}