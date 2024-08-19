import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from '../../services/http.service';
import { AuthService } from '../../services/auth.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.scss'],
  providers: [DatePipe]
})
export class CreateEventComponent implements OnInit {
  itemForm: FormGroup;
  eventList: any[] = [];
  filteredEvents: any[] = [];
  showError: boolean = false;
  errorMessage: string = '';
  showMessage: boolean = false;
  responseMessage: string = '';
  minDate: string;

  // Pagination variables
  Math = Math;
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalItems: number = 0;
  searchTerm: string = '';

  isAscending: boolean = true;
  expandedEvent: any = null;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private httpService: HttpService,
    private authService: AuthService,
    private datePipe: DatePipe,
    private cdr: ChangeDetectorRef
  ) {
    this.minDate = this.getTodayDate();

    this.itemForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      materials: ['', Validators.required],
      date: [this.getTodayDate(), Validators.required]
    });
  }

  ngOnInit(): void {
    this.getEvents();
  }

  getEvents(): void {
    this.httpService.getAllEventsSortedByDate(this.isAscending).subscribe(
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

  onSubmit(): void {
    if (this.itemForm.valid) {
      const newEvent = this.itemForm.value;

      // Check if event with same name already exists
      const isDuplicate = this.eventList.some(event =>
        event.name.toLowerCase() === newEvent.name.toLowerCase()
      );

      if (isDuplicate) {
        this.showError = true;
        this.errorMessage = 'An event with this name already exists';
        return;
      }

      this.httpService.createEvent(newEvent).subscribe(
        (response) => {
          this.showError = false;
          this.showMessage = true;
          this.responseMessage = 'Event created successfully';
          this.itemForm.reset({
            name: '',
            description: '',
            materials: '',
            date: this.getTodayDate()
          });
          this.itemForm.markAsPristine();
          this.itemForm.markAsUntouched();
          this.getEvents();
          this.cdr.detectChanges();
        },
        (error) => {
          this.showMessage = false;
          this.showError = true;
          this.errorMessage = error.message || 'An error occurred while creating the event';
        }
      );
    } else {
      this.itemForm.markAllAsTouched();
    }
  }

  onDelete(eventId: any): void {
    this.httpService.deleteEvent(eventId).subscribe(() => {
      this.getEvents();
    });
  }

  toggleSort(): void {
    this.isAscending = !this.isAscending;
    if (this.searchTerm) {
      this.sortFilteredEvents();
    } else {
      this.getEvents();
    }
  }

  sortFilteredEvents(): void {
    this.filteredEvents.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return this.isAscending ? dateA - dateB : dateB - dateA;
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

  private getTodayDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  toggleExpand(event: any): void {
    if (this.expandedEvent === event) {
      this.expandedEvent = null;
    } else {
      this.expandedEvent = event;
    }
  }

  isExpanded(event: any): boolean {
    return this.expandedEvent === event;
  }

  clearMessages(): void {
    this.showError = false;
    this.showMessage = false;
    this.errorMessage = '';
    this.responseMessage = '';
  }
}