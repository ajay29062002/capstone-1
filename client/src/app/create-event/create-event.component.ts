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
  eventList: any[] = [];
  filteredEvents: any[] = [];
  assignModel: any = {};
  showMessage: any;
  responseMessage: any;
  minDate: string;

  Math = Math;
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalItems: number = 0;
  searchTerm: string = '';

  isAscending: boolean = true;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private httpService: HttpService,
    private authService: AuthService,
  ) {
    this.minDate = this.getTodayDate();

    this.itemForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      materials: ['', Validators.required],
      date: ['']
    });
  }

  ngOnInit(): void {
    this.getEvent();
  }

  getEvent(): void {
    this.httpService.getAllEventsSortedByName(this.isAscending).subscribe(
      (data) => {
        this.eventList = data;
        this.filteredEvents = [...this.eventList];
        this.totalItems = this.filteredEvents.length;
      },
      (error) => {
        this.showError = true;
        this.errorMessage = 'Failed to fetch events';
        console.error('Error fetching events:', error);
      }
    );
  }

  toggleSort(): void {
    this.isAscending = !this.isAscending;
    this.getEvent();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
  }

  get paginatedEvents(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredEvents.slice(startIndex, endIndex);
  }

  onSubmit(): void {
    if (this.itemForm.valid) {
      const formData = { ...this.itemForm.value };

      if (!formData.date) {
        delete formData.date;
      }

      this.httpService.createEvent(formData).subscribe(
        (response) => {
          this.showMessage = true;
          this.responseMessage = 'Event created successfully';
          this.itemForm.reset();
          this.getEvent();
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
    this.httpService.deleteEvent(eventId).subscribe(() => {
      this.getEvent();
    });
  }

  onSearch(): void {
    if (!this.searchTerm) {
      this.filteredEvents = [...this.eventList];
    } else {
      this.filteredEvents = this.eventList.filter(event =>
        (event.name?.toLowerCase().includes(this.searchTerm.toLowerCase()) || '') ||
        (event.description?.toLowerCase().includes(this.searchTerm.toLowerCase()) || '') ||
        (event.materials?.toLowerCase().includes(this.searchTerm.toLowerCase()) || '') ||
        (event.date?.includes(this.searchTerm) || '')
      );
    }
    this.totalItems = this.filteredEvents.length;
    this.currentPage = 1;
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.onSearch();
  }

  private getTodayDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}