import { identifierName } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
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
  formModel:any={role:null,email:'',password:'',username:''};
  showMessage:boolean=false;

  responseMessage: any;
  constructor(public router:Router, private httpService:HttpService, private formBuilder: FormBuilder) { 
    
      this.itemForm = this.formBuilder.group({
        email: [this.formModel.email,[ Validators.required, Validators.email]],
        password: [this.formModel.password,[ Validators.required,this.passwordValidator]],
        role: ['',[ Validators.required]],
        username: [this.formModel.username,[ Validators.required]],
       
    });
  }

  ngOnInit(): void {}

  passwordValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const password = control.value;
    const regexPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;


    if (!regexPattern.test(password)) {
      return { invalidPassword: true };
    }

    return null;
  }

  // uniqueIdValidator (control: AbstractControl): ValidationErrors | null  {
  //   const userName=control.value;
  //   let value=JSON.parse(localStorage.getItem('userName') || '{}');
  //   const UserName = value.map((id:any)=> id.username);
  //   if(UserName.includes(userName)){
  //     return {unique :true};
  //   }

  //   return null;
  // //   const userName= control.value;
  // //   let value=JSON.parse(localStorage.getItem('userName') || '{}');
  // //     const UserName = value.map((id:any) => id.policyNumber);
  // //     if (policyIDd.includes(employeeID)) {
  // //      return { unique: true }; // Validation failed because the ID is not unique
  // //    } 
  // //     return null; // Validation passed, ID is unique
  //  }



  onRegister(): void {

    

    if(this.itemForm.valid)
    {
      this.showMessage=false;
      this.httpService.registerUser(this.itemForm.value).subscribe(data=>{    
        
        this.showMessage=true;
        this.responseMessage=`Welcome ${data.username} you are successfully registered`;
        this.router.navigateByUrl('/login');
        
      },error=>{ })
    }
    else{
      this.itemForm.markAllAsTouched();
    }
  }
  }

