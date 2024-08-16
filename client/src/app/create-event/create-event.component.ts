import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from '../../services/http.service';
import { AuthService } from '../../services/auth.service';
 
@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.scss']
})
export class CreateEventComponent implements OnInit {
  itemForm: FormGroup;
  formModel: any = {};
  showError: boolean = false;
  errorMessage: any;
  eventList: any;
  assignModel: any = {};
  showMessage: any;
  responseMessage: any;
 
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private httpService: HttpService,
    private authService: AuthService
  ) {
    this.itemForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      materials: ['', [Validators.required]]
      
      // date:['',[Validators.required , this.dateValidator]]
      
      // Add more form controls as needed
    });
  }
 
  ngOnInit(): void {
    this.getEvent();
  }
 
  // dateValidator(control: AbstractControl): ValidationErrors | null {
  //     const datePattern = /^\d{4}-\d{2}-\d{2}$/;
  //     if (!datePattern.test(control.value)) {
  //       return { invalidDate: true };
  //     }
  //     return null;
    
  // }
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
 
  onSubmit(): void {
    if (this.itemForm.valid) {
      this.httpService.createEvent(this.itemForm.value).subscribe(
        (response) => {
          this.showMessage = true;
          this.responseMessage = 'Event created successfully';
          this.itemForm.reset();
          this.getEvent(); // Refresh the event list
        },
        (error) => {
          this.showError = true;
          this.errorMessage = 'Failed to create event';
          console.error('Error creating event:', error);
        }
      );
    } else {
      this.itemForm.markAllAsTouched();
    }
  }
 
 
 
  onDelete(eventId: any): void {
  //  alert(eventId);
    this.httpService.deleteEvent(eventId).subscribe(()=>{
      this.getEvent();
          });
   
   
 
  }
}