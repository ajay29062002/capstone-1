import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpService } from '../../services/http.service';

@Component({
  selector: 'app-resource-allocate',
  templateUrl: './resource-allocate.component.html',
  styleUrls: ['./resource-allocate.component.scss']
})
export class ResourceAllocateComponent implements OnInit {
  itemForm!: FormGroup; // Initialize here
  formModel: any = {};
  showError: boolean = false;
  errorMessage: any;
  resourceList: any;
  assignModel: any = {};
  showMessage: any;
  responseMessage: any;
  eventList: any;
  

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
      // Add more form controls if needed, for example:
      // quantity: ['', [Validators.required, Validators.min(1)]],
    });
  }

  onSubmit(): void {
    if (this.itemForm.valid) {
      const eventId = this.itemForm.get('eventId')?.value;
      const resourceId = this.itemForm.get('resourceId')?.value;
      const details = {
        // Add any additional details required by your API
        // For example:
        // allocationDate: new Date(),
        // quantity: this.itemForm.get('quantity')?.value,
      };

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
      },
      (error) => {
        this.showError = true;
        this.errorMessage = 'Failed to fetch resources';
        console.error('Error fetching resources:', error);
      }
    );
  }
}