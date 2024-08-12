import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from '../../services/http.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-booking-details',
  templateUrl: './booking-details.component.html',
  styleUrls: ['./booking-details.component.scss']
})
export class BookingDetailsComponent implements OnInit {
  formModel: any;
  showError: boolean = false;
  errorMessage: any = null;
  eventObj: any = null;
  assignModel: any = {};
  showMessage: any = false;
  responseMessage: any = null;
  isUpdate: any = false;
  eventList: any = null;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private httpService: HttpService,
    private authService: AuthService
  ) {
    // Initialize formModel
    this.formModel = this.formBuilder.group({
      searchTerm: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Initialization logic
    this.getEvents();
  }

  searchEvent(): void {
    if (this.formModel.valid) {
      const searchTerm = this.formModel.get('searchTerm')?.value;
      this.httpService.getBookingDetails(searchTerm).subscribe(
        (response) => {
          this.eventObj = response;
          this.showMessage = true;
          this.responseMessage = 'Event found';
        },
        (error) => {
          this.showError = true;
          this.errorMessage = 'Failed to find event';
          console.error('Error searching event:', error);
        }
      );
    } else {
      this.formModel.markAllAsTouched();
    }
  }

  private getEvents(): void {
    this.httpService.GetAllevents().subscribe(
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
}