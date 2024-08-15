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
  resourceList: any;
  assignModel: any = {};
  showMessage: any;
  responseMessage: any;
 
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private httpService: HttpService,
    private authService: AuthService
  ) {
    this.itemForm = this.formBuilder.group({
     // Add form controls here
      //For example:
      description: ['', [Validators.required]],
      resourceType: ['', [Validators.required]],
      availability: ['', [Validators.required]]
     
    });
  }
 
  ngOnInit(): void {
    this.getResources();
  }
 
  onSubmit(): void {
    if (this.itemForm.valid) {
      // Handle form submission
      // For example:
      this.httpService.addResource(this.itemForm.value).subscribe(
        (response) => {
          this.showMessage = true;
          this.responseMessage = 'Resource added successfully';
          this.getResources(); // Refresh the resource list
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
    //  alert(eventId);
      this.httpService.deleteResource(resourceId).subscribe(()=>{
        this.getResources();
            });
          }
  getResources(): void {
    // Fetch resources from the server
    // For example:
    this.httpService.GetAllResources().subscribe(
      (data) => {
        this.resourceList = data;
      },
      (error) => {
        this.showError = true;
        this.errorMessage = 'Failed to fetch resources';
      }
    );
  }
}