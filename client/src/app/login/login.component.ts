import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from '../../services/http.service';
import { AuthService } from '../../services/auth.service';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  itemForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.itemForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
  //   if (this.itemForm.valid) {
  //     this.authService.login(this.itemForm.value).subscribe(
  //       response => {
  //         console.log('Login successful', response);
  //         this.router.navigate(['/dashboard']);
  //       },
  //       error => {
  //         console.error('Login failed', error);
  //       }
  //     );
  //   }
  // }
}
}