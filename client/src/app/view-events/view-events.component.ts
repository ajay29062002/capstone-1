import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from '../../services/http.service';
import { AuthService } from '../../services/auth.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-view-events',
  templateUrl: './view-events.component.html',
  styleUrls: ['./view-events.component.scss'],
  providers: [DatePipe]
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
  filteredEvents: any[] = [];
  minDate: string;

  // Pagination variables
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
    private datePipe: DatePipe
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
      date: ['', Validators.required]
    });
  }

  loadEvents(): void {
    this.httpService.getAllEventAgenda().subscribe(
      (data) => {
        this.eventList = data;
        this.filteredEvents = [...this.eventList];
        this.sortFilteredEvents();
        this.totalItems = this.filteredEvents.length;
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
      eventData.date = this.formatDate(eventData.date);

      if (this.isUpdate) {
        this.httpService.updateEvent(eventData, this.eventObj.id).subscribe(
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
      materials: val.materials,
      date: val.date
    });
  }

  resetForm(): void {
    this.isUpdate = false;
    this.eventObj = null;
    this.itemForm.reset();
  }

  private getTodayDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  private formatDate(date: string): string {
    return new Date(date).toISOString().split('T')[0];
  }

  toggleSort(): void {
    this.isAscending = !this.isAscending;
    this.sortFilteredEvents();
  }

  sortFilteredEvents(): void {
    this.filteredEvents.sort((a, b) => {
      return this.isAscending
        ? a.date.localeCompare(b.date)
        : b.date.localeCompare(a.date);
    });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
  }

  get paginatedEvents(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredEvents.slice(startIndex, endIndex);
  }

  onSearch(): void {
    if (!this.searchTerm) {
      this.filteredEvents = [...this.eventList];
    } else {
      const searchLower = this.searchTerm.toLowerCase();
      this.filteredEvents = this.eventList.filter(event => {
        const formattedDate = this.datePipe.transform(event.date, 'dd-MM-yyyy') || '';
        return event.name.toLowerCase().includes(searchLower) ||
          event.description.toLowerCase().includes(searchLower) ||
          event.materials.toLowerCase().includes(searchLower) ||
          formattedDate.includes(searchLower);
      });
    }
    this.sortFilteredEvents();
    this.totalItems = this.filteredEvents.length;
    this.currentPage = 1;
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.onSearch();
  }
}