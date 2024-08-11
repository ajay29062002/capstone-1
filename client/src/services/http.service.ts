import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment.development';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  
  public serverName=environment.apiUrl;
//todo: Complete missing code..
 
  
  
constructor(private http: HttpClient, private authService: AuthService) { }

  private getHeaders(): HttpHeaders {

    const token = this.authService.getToken();

    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }
  getBookingDetails(studentId: number): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get<any>(`${this.serverName}/api/student/registration-status/${studentId}`, { headers });
  }
  GetAllevents(): Observable<any[]> {
    const headers = this.getHeaders();
    return this.http.get<any[]>(`${this.serverName}/api/institution/events`, { headers });
  }
  GetAllResources(): Observable<any[]> {
    const headers = this.getHeaders();
    return this.http.get<any[]>(`${this.serverName}/api/institution/resources`, { headers });
  }
  createEvent(details: any): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post<any>(`${this.serverName}/api/institution/event`, details, { headers });
  }
  updateEvent(details: any, eventId: number): Observable<any> {
    const headers = this.getHeaders();
    return this.http.put<any>(`${this.serverName}/api/educator/update-material/${eventId}`, details, { headers });
  }
  addResource(details: any): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post<any>(`${this.serverName}/api/institution/resource`, details, { headers });
  }
  allocateResources(eventId: number, resourceId: number, details: any): Observable<any> {
    const headers = this.getHeaders();

    return this.http.post<any>(`${this.serverName}/api/institution/event/allocate-resources?eventId=${eventId}&resourceId=${resourceId}`, details, { headers });

  }

  Login(details: any): Observable<any> {

    return this.http.post<any>(`${this.serverName}/api/user/login`, details, {

      headers: new HttpHeaders({

        'Content-Type': 'application/json'

      })

    });

  }

  registerUser(details: any): Observable<any> {

    return this.http.post<any>(`${this.serverName}/api/user/register`, details, {

      headers: new HttpHeaders({

        'Content-Type': 'application/json'

      })

    });

  }

}
