import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from '../../services/http.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-add-resource',
  templateUrl: './add-resource.component.html',
  styleUrls: ['./add-resource.component.scss']
})
export class AddResourceComponent implements OnInit {
  itemForm: FormGroup;
  resourceList: any[] = [];
  filteredResources: any[] = [];
  showError: boolean = false;
  errorMessage: string = '';
  showMessage: boolean = false;
  responseMessage: string = '';

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
    private cdr: ChangeDetectorRef
  ) {
    this.itemForm = this.formBuilder.group({
      description: ['', Validators.required],
      resourceType: ['', Validators.required],
      availability: ['available', Validators.required]
    });
  }

  ngOnInit(): void {
    this.getResources();
  }

  getResources(): void {
    this.httpService.getAllResourcesSortedByDescription(this.isAscending).subscribe(
      (data) => {
        this.resourceList = data;
        this.filteredResources = [...this.resourceList];
        this.totalItems = this.filteredResources.length;
      },
      (error) => {
        this.showError = true;
        this.errorMessage = 'Failed to fetch resources';
        console.error('Error fetching resources:', error);
      }
    );
  }

  onSubmit(): void {
    if (this.itemForm.valid) {
      const newResource = this.itemForm.value;

      // Check if resource with same description already exists
      const isDuplicate = this.resourceList.some(resource =>
        resource.description.toLowerCase() === newResource.description.toLowerCase()
      );

      if (isDuplicate) {
        this.showError = true;
        this.errorMessage = 'A resource with this description already exists';
        return;
      }

      this.httpService.addResource(newResource).subscribe(
        (response) => {
          this.showError = false;
          this.showMessage = true;
          this.responseMessage = 'Resource added successfully';
          this.itemForm.reset({
            description: '',
            resourceType: '',
            availability: 'available'
          });
          this.itemForm.markAsPristine();
          this.itemForm.markAsUntouched();
          this.getResources();
          this.cdr.detectChanges();
        },
        (error) => {
          this.showMessage = false;
          this.showError = true;
          this.errorMessage = error.message || 'An error occurred while adding the resource';
        }
      );
    } else {
      this.itemForm.markAllAsTouched();
    }
  }

  onDelete(resourceId: any): void {
    this.httpService.deleteResource(resourceId).subscribe(() => {
      this.getResources();
    });
  }

  toggleSort(): void {
    this.isAscending = !this.isAscending;
    if (this.searchTerm) {
      this.sortFilteredResources();
    } else {
      this.getResources();
    }
  }

  sortFilteredResources(): void {
    this.filteredResources.sort((a, b) => {
      const descA = a.description.toLowerCase();
      const descB = b.description.toLowerCase();
      return this.isAscending ? descA.localeCompare(descB) : descB.localeCompare(descA);
    });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
  }

  get paginatedResources(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredResources.slice(startIndex, endIndex);
  }

  onSearch(): void {
    if (!this.searchTerm) {
      this.filteredResources = [...this.resourceList];
    } else {
      const searchLower = this.searchTerm.toLowerCase();
      this.filteredResources = this.resourceList.filter(resource => {
        return resource.description.toLowerCase().includes(searchLower) ||
          resource.resourceType.toLowerCase().includes(searchLower) ||
          resource.availability.toLowerCase().includes(searchLower);
      });
    }
    this.sortFilteredResources();
    this.totalItems = this.filteredResources.length;
    this.currentPage = 1;
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.onSearch();
  }

  clearMessages(): void {
    this.showError = false;
    this.showMessage = false;
    this.errorMessage = '';
    this.responseMessage = '';
  }
}