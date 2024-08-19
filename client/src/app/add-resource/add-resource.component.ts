import { Component, OnInit } from '@angular/core';
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
  formModel: any = {};
  showError: boolean = false;
  errorMessage: any;
  resourceList: any[] = [];
  filteredResources: any[] = [];
  assignModel: any = {};
  showMessage: any;
  responseMessage: any;

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
    private authService: AuthService
  ) {
    this.itemForm = this.formBuilder.group({
      description: ['', Validators.required],
      resourceType: ['', Validators.required],
      availability: ['available', Validators.required]
    });
    this.filteredResources = [];
  }

  ngOnInit(): void {
    this.getResources();
  }

  onSubmit(): void {
    if (this.itemForm.valid) {
      this.httpService.addResource(this.itemForm.value).subscribe(
        (response) => {
          this.showMessage = true;
          this.responseMessage = 'Resource added successfully';
          this.itemForm.reset();
          this.getResources();
        },
        (error) => {
          this.showError = true;
          this.errorMessage = 'Failed to add resource';
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
      }
    );
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
        if (searchLower === 'available' || searchLower === 'unavailable') {
          return resource.availability.toLowerCase() === searchLower;
        } else {
          return resource.description.toLowerCase().includes(searchLower) ||
            resource.resourceType.toLowerCase().includes(searchLower) ||
            resource.availability.toLowerCase().includes(searchLower);
        }
      });
    }
    this.sortFilteredResources(); // Apply sorting after filtering
    this.totalItems = this.filteredResources.length;
    this.currentPage = 1;
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.onSearch();
  }

}