import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { HttpService } from '../../services/http.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
  users$: Observable<any[]> = of([]);
  itemForm: FormGroup;
  formModel: any = { role: null, email: '', password: '', username: '' };
  showMessage: boolean = false;
  responseMessage: string = '';

  constructor(
    public router: Router,
    private httpService: HttpService,
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {
    this.itemForm = this.formBuilder.group({
      email: [this.formModel.email, [Validators.required, Validators.email]],
      password: [this.formModel.password, [Validators.required, this.passwordValidator]],
      role: [this.formModel.role, [Validators.required]],
      username: [this.formModel.username, [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.users$ = this.httpService.getAllUsers();

    this.users$.subscribe((userArray) => {
      if (userArray) {
        localStorage.setItem('users', JSON.stringify(userArray));
      }
    });
  }

  passwordValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const password = control.value;
    const regexPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

    if (!regexPattern.test(password)) {
      return { invalidPassword: true };
    }

    return null;
  }

  uniqueUsernameValidator(userName: string): ValidationErrors | null {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (Array.isArray(users)) {
      const userNameArray = users.map((user: any) => user.username);
      if (userNameArray.includes(userName)) {
        return { notUnique: true };
      }
    }
    return null;
  }

  onRegister(): void {
    if (this.itemForm.valid) {
      const usernameControl = this.itemForm.get('username');
      const usernameValue = usernameControl?.value;
      const uniqueUsernameError = this.uniqueUsernameValidator(usernameValue);

      if (uniqueUsernameError) {
        usernameControl?.setErrors(uniqueUsernameError);
        this.itemForm.markAllAsTouched();
        return;
      }

      // this.showMessage = false;
      this.httpService.registerUser(this.itemForm.value).subscribe(
        (data) => {
          
          this.showMessage = true;
          console.log(this.showMessage);
          this.responseMessage = `Welcome ${data.username}, you are successfully registered`;
         // this.router.navigateByUrl('/login');
         setTimeout(() => {
          this.router.navigateByUrl('/login');
        }, 2000);
        },
        (error) => {
          this.showMessage = true;
          this.responseMessage = 'Registration failed. Please try again.';
        }
      );
    } else {
      this.itemForm.markAllAsTouched();
    }
  }
}
