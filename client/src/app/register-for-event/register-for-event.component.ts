import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from '../../services/http.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register-for-event',
  templateUrl: './register-for-event.component.html',
  styleUrls: ['./register-for-event.component.scss']
})
export class RegisterForEventComponent implements OnInit {
  eventList: any[] = [];
  showError: boolean = false;
  errorMessage: string = '';
  showMessage: boolean = false;
  responseMessage: string = '';
  id: string|null;

  constructor(
    private router: Router,
    private httpService: HttpService,
    private authService: AuthService
  ) { 
    this.id = this.authService.getId;
  }

  ngOnInit() {
    this.getEvents();
  }

  getEvents(): void {
    this.httpService.GetAlleventsforstudent().subscribe(
      (data) => {
        this.eventList = data;
      },
      (error) => {
        this.showError = true;
        this.errorMessage = 'Failed to fetch events';
        console.error('Error fetching events:', error);
      }
    );
  }

  registerForEvent(eventId: string) {
    const eventRegistration = { studentId: this.id, status: "registered" };

    this.httpService.registerForEvent(eventId, eventRegistration).subscribe(
      (response) => {
        this.showError = false;
        this.showMessage = true;
        this.responseMessage = 'Registration successful';
      },
      (error) => {
        this.showMessage = false;
        this.showError = true;
        this.errorMessage = error.message || 'An error occurred during registration';
      }
    );
  }
}