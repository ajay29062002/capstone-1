import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-view-registrations',
  templateUrl: './view-registrations.component.html',
  styleUrls: ['./view-registrations.component.scss'],
  providers: [DatePipe]
})
export class ViewRegistrationsComponent implements OnInit {
  registrationList: any[] = [];
  filteredRegistrations: any[] = [];
  showError: boolean = false;
  errorMessage: string = '';

  // Pagination variables
  Math = Math;
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;
  searchTerm: string = '';

  isAscending: boolean = true;

  constructor(
    private httpService: HttpService,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.getRegistrations();
  }

  getRegistrations(): void {
    this.httpService.getAllEventRegistrations().subscribe(
      (data) => {
        this.registrationList = data;
        this.filteredRegistrations = [...this.registrationList];
        this.totalItems = this.filteredRegistrations.length;
        this.sortRegistrations();
      },
      (error) => {
        this.showError = true;
        this.errorMessage = 'Failed to fetch registrations';
        console.error('Error fetching registrations:', error);
      }
    );
  }

  toggleSort(): void {
    this.isAscending = !this.isAscending;
    this.sortRegistrations();
  }

  sortRegistrations(): void {
    this.filteredRegistrations.sort((a, b) => {
      const dateA = new Date(a.event.date).getTime();
      const dateB = new Date(b.event.date).getTime();
      return this.isAscending ? dateA - dateB : dateB - dateA;
    });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
  }

  get paginatedRegistrations(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredRegistrations.slice(startIndex, endIndex);
  }

  onSearch(): void {
    if (!this.searchTerm) {
      this.filteredRegistrations = [...this.registrationList];
    } else {
      const searchLower = this.searchTerm.toLowerCase();
      this.filteredRegistrations = this.registrationList.filter(registration => {
        const eventDate = this.datePipe.transform(registration.event.date, 'dd-MM-yyyy') || '';
        return registration.event.name.toLowerCase().includes(searchLower) ||
          registration.status.toLowerCase().includes(searchLower) ||
          registration.studentId.toString().includes(searchLower) ||
          eventDate.includes(searchLower);
      });
    }
    this.sortRegistrations();
    this.totalItems = this.filteredRegistrations.length;
    this.currentPage = 1;
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.onSearch();
  }
}