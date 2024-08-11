import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpService } from '../../services/http.service';


@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
  itemForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.itemForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      role: [null, Validators.required],
      username: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    // if (this.itemForm.valid) {
    //   this.authService.register(this.itemForm.value).subscribe(
    //     response => {
    //       console.log('Registration successful', response);
    //       this.router.navigate(['/login']);
    //     },
    //     error => {
    //       console.error('Registration failed', error);
    //     }
    //   );
    // }
  }
}
