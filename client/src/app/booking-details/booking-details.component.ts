import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { AuthService } from '../../services/auth.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-booking-details',
  templateUrl: './booking-details.component.html',
  styleUrls: ['./booking-details.component.scss'],
  providers: [DatePipe]
})
export class BookingDetailsComponent implements OnInit {
  showError: boolean = false;
  errorMessage: string | null = null;
  eventObj: any[] = [];
  filteredEvents: any[] = [];
  showMessage: boolean = false;
  responseMessage: string | null = null;

  // Pagination variables
  Math = Math;
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalItems: number = 0;
  searchTerm: string = '';

  isAscending: boolean = true;

  constructor(
    private httpService: HttpService,
    private authService: AuthService,
    private datePipe: DatePipe
  ) { }

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
            this.sortEvents();
            this.filteredEvents = [...this.eventObj];
            this.totalItems = this.filteredEvents.length;
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

  toggleSort(): void {
    this.isAscending = !this.isAscending;
    this.sortEvents();
  }

  sortEvents(): void {
    this.filteredEvents.sort((a, b) => {
      const dateA = new Date(a.event.date).getTime();
      const dateB = new Date(b.event.date).getTime();
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
      this.filteredEvents = [...this.eventObj];
    } else {
      const searchLower = this.searchTerm.toLowerCase();
      this.filteredEvents = this.eventObj.filter(event => {
        const formattedDate = this.datePipe.transform(event.event.date, 'dd-MM-yyyy') || '';
        return event.status.toLowerCase().includes(searchLower) ||
          event.event.name.toLowerCase().includes(searchLower) ||
          event.event.description.toLowerCase().includes(searchLower) ||
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