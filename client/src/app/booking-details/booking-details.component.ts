import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-booking-details',
  templateUrl: './booking-details.component.html',
  styleUrls: ['./booking-details.component.scss']
})
export class BookingDetailsComponent implements OnInit {
  showError: boolean = false;
  errorMessage: string | null = null;
  eventObj: any = null;
  showMessage: boolean = false;
  responseMessage: string | null = null;

  constructor(
    private httpService: HttpService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadStudentEvents();
  }

  loadStudentEvents(): void {
    const studentId = this.authService.getId;
    if (studentId) {
      this.httpService.getBookingDetails(studentId).subscribe(
        (response) => {
          if (response.length !== 0) {
            console.log(response);
            this.eventObj = response;
            this.showMessage = false;
            this.responseMessage = 'Events loaded successfully';
            this.showError = false;
          } else {
            this.showMessage = false;
            this.showError = true;
            this.errorMessage = 'No registered events found';
          }
        },
        (error) => {
          this.showError = true;
          this.errorMessage = 'Failed to load events';
          console.error('Error loading events:', error);
        }
      );
    } else {
      this.showError = true;
      this.errorMessage = 'Student ID not found. Please log in.';
    }
  }
}