import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from '../../services/http.service';
import { AuthService } from '../../services/auth.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-register-for-event',
  templateUrl: './register-for-event.component.html',
  styleUrls: ['./register-for-event.component.scss'],
  providers: [DatePipe]
})
export class RegisterForEventComponent implements OnInit {
  eventList: any[] = [];
  filteredEvents: any[] = [];
  showError: boolean = false;
  errorMessage: string = '';
  showMessage: boolean = false;
  responseMessage: string = '';
  id: string | null;

  // Pagination variables
  Math = Math;
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalItems: number = 0;
  searchTerm: string = '';

  isAscending: boolean = true;

  constructor(
    private router: Router,
    private httpService: HttpService,
    private authService: AuthService,
    private datePipe: DatePipe
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
        this.sortEvents();
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
        if (error.status === 400) {
          this.errorMessage = 'You are already registered for this event';
        } else {
          this.errorMessage = error.message || 'An error occurred during registration';
        }
      }
    );
  }

  toggleSort(): void {
    this.isAscending = !this.isAscending;
    this.sortEvents();
  }

  sortEvents(): void {
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
          formattedDate.includes(searchLower);
      });
    }
    this.sortEvents();
    this.totalItems = this.filteredEvents.length;
    this.currentPage = 1;
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.onSearch();
  }
}