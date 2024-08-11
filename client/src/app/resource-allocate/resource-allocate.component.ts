import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from '../../services/http.service';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-resource-allocate',
  templateUrl: './resource-allocate.component.html',
  styleUrls: ['./resource-allocate.component.scss']
})
export class ResourceAllocateComponent implements OnInit {
  itemForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private httpService: HttpService,
    private router: Router
  ) {
    this.itemForm = this.formBuilder.group({
      eventId: ['', Validators.required],
      resourceId: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    // if (this.itemForm.valid) {
    //   this.httpService.allocateResource(this.itemForm.value).subscribe(
    //     response => {
    //       console.log('Resource allocated successfully', response);
    //       this.router.navigate(['/resources']);
    //     },
    //     error => {
    //       console.error('Error allocating resource', error);
    //     }
    //   );
    // }
  }
}