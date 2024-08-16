import { Component, OnInit, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpService } from '../../services/http.service';

@Component({
  selector: 'app-resource-allocate',
  templateUrl: './resource-allocate.component.html',
  styleUrls: ['./resource-allocate.component.scss']
})
export class ResourceAllocateComponent implements OnInit {
  itemForm!: FormGroup;
  showError: boolean = false;
  errorMessage: string = '';
  resourceList: any[] = [];
  showMessage: boolean = false;
  responseMessage: string = '';
  eventList: any[] = [];
  showEventDropdown: boolean = false;
  showResourceDropdown: boolean = false;
  filteredEventList: any[] = [];
  filteredResourceList: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private httpService: HttpService
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.getEvent();
    this.getResources();
  }

  private initForm(): void {
    this.itemForm = this.formBuilder.group({
      eventId: ['', Validators.required],
      resourceId: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.itemForm.valid) {
      const eventId = this.itemForm.get('eventId')?.value;
      const resourceId = this.itemForm.get('resourceId')?.value;
      const details = {};

      this.httpService.allocateResources(eventId, resourceId, details).subscribe(
        (response) => {
          this.showMessage = true;
          this.responseMessage = 'Resource allocated successfully';
          this.itemForm.reset();
        },
        (error) => {
          this.showError = true;
          this.errorMessage = 'Failed to allocate resource';
          console.error('Error allocating resource:', error);
        }
      );
    } else {
      this.itemForm.markAllAsTouched();
    }
  }

  getEvent(): void {
    this.httpService.GetAllevents().subscribe(
      (data) => {
        this.eventList = data;
        this.filteredEventList = [...this.eventList];
      },
      (error) => {
        this.showError = true;
        this.errorMessage = 'Failed to fetch events';
        console.error('Error fetching events:', error);
      }
    );
  }

  getResources(): void {
    this.httpService.GetAllResources().subscribe(
      (data) => {
        this.resourceList = data;
        this.filteredResourceList = [...this.resourceList];
      },
      (error) => {
        this.showError = true;
        this.errorMessage = 'Failed to fetch resources';
        console.error('Error fetching resources:', error);
      }
    );
  }

  toggleEventDropdown() {
    this.showEventDropdown = !this.showEventDropdown;
    this.showResourceDropdown = false;
  }

  toggleResourceDropdown() {
    this.showResourceDropdown = !this.showResourceDropdown;
    this.showEventDropdown = false;
  }

  selectEvent(event: any) {
    this.itemForm.patchValue({ eventId: event.id });
    this.showEventDropdown = false;
  }

  selectResource(resource: any) {
    this.itemForm.patchValue({ resourceId: resource.id });
    this.showResourceDropdown = false;
  }

  getEventName(eventId: string): string {
    const event = this.eventList?.find((e: any) => e.id === eventId);
    return event ? event.name : '';
  }

  getResourceName(resourceId: string): string {
    const resource = this.resourceList?.find((r: any) => r.id === resourceId);
    return resource ? resource.resourceType : '';
  }

  searchEvents(event: Event): void {
    const searchTerm = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredEventList = this.eventList.filter((event: any) =>
      event.name.toLowerCase().includes(searchTerm)
    );
  }

  searchResources(event: Event): void {
    const searchTerm = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredResourceList = this.resourceList.filter((resource: any) =>
      resource.resourceType.toLowerCase().includes(searchTerm)
    );
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!(event.target as HTMLElement).closest('.custom-dropdown')) {
      this.showEventDropdown = false;
      this.showResourceDropdown = false;
    }
  }
}