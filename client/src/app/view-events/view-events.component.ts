import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from '../../services/http.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-view-events',
  templateUrl: './view-events.component.html',
  styleUrls: ['./view-events.component.scss']
})
export class ViewEventsComponent implements OnInit {
  itemForm!: FormGroup;
  formModel: any = {};
  showError: boolean = false;
  errorMessage: any;
  eventObj: any;
  assignModel: any;
  showMessage: any;
  responseMessage: any;
  isUpdate: any = false;
  eventList: any[] = [];
  minDate: string;
  

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private httpService: HttpService,
    private authService: AuthService
  ) {
    this.minDate = this.getTodayDate();
   }

  ngOnInit(): void {
    this.initForm();
    this.loadEvents();
  }

  initForm(): void {
    this.itemForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      materials: ['', Validators.required],
      date:['']
    });
  }

  loadEvents(): void {
    this.httpService.getAllEventAgenda().subscribe(
      (data) => {
        this.eventList = data;
      },
      (error) => {
        this.showError = true;
        this.errorMessage = 'Error loading events: ' + error.message;
      }
    );
  }

  onSubmit(): void {
    if (this.itemForm.valid) {
      const eventData = this.itemForm.value;
      
      if (this.isUpdate) {
        this.httpService.updateEvent( eventData,this.eventObj.id).subscribe(
          (response) => {
            this.showMessage = true;
            this.responseMessage = 'Event updated successfully';
            this.loadEvents();
            this.resetForm();
          },
          (error) => {
            this.showError = true;
            this.errorMessage = 'Error updating event: ' + error.message;
          }
        );
      } else {
        this.httpService.createEvent(eventData).subscribe(
          (response) => {
            this.showMessage = true;
            this.responseMessage = 'Event created successfully';
            this.loadEvents();
            this.resetForm();
          },
          (error) => {
            this.showError = true;
            this.errorMessage = 'Error creating event: ' + error.message;
          }
        );
      }
    } else {
      this.showError = true;
      this.errorMessage = 'Please fill all required fields';
    }
  }

  edit(val: any): void {
    this.isUpdate = true;
    this.eventObj = val;
    this.itemForm.patchValue({
      name: val.name,
      description: val.description,
      materials: val.materials
    });
  }

  resetForm(): void {
    this.isUpdate = false;
    this.eventObj = null;
    this.itemForm.reset();
  }

  private getTodayDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
