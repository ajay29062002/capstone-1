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
  formModel: any;
  showError: boolean = false;
  errorMessage: any;
  eventObj: any;
  assignModel: any;
  showMessage: any;
  responseMessage: any;
  isUpdate: any;
  eventList: any;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private httpService: HttpService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.initForm();
    this.getEvent();
  }

  initForm() {
    this.formModel = this.formBuilder.group({
      eventId: ['', Validators.required],
      studentId: ['', Validators.required],
      status: ['registered']
    });
  }

  getEvent(): void {
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

  submit() {
    if (this.formModel.valid) {
      const eventId = this.formModel.get('eventId').value;
      const studentId = this.formModel.get('studentId').value;



      this.httpService.registerForEvent(eventId, studentId).subscribe(
        (response) => {
          this.showError = false
          this.showMessage = true;
          this.responseMessage = 'Registration successful';
          this.formModel.reset();
        },
        (error) => {
          this.showMessage = false;
          this.showError = true;
          this.errorMessage = error.message || 'An error occurred during registration';
        }
      );
    } else {
      this.showError = true;
      this.errorMessage = 'Please fill all required fields';
    }
  }
}