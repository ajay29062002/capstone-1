import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  IsLoggin: any = false;
  roleName: string | null;
  user:any|null;
  id:any|null;
  
 
  constructor(private authService: AuthService, private router: Router ) {
    this.IsLoggin = authService.getLoginStatus;
    this.roleName = authService.getRole;
    this.user=authService.getName;
    this.id=authService.getId;
    
   

    
    if (this.IsLoggin == false) {
      this.router.navigateByUrl('/login');

    }
  }
  logout() {
    this.authService.logout();
    window.location.reload();
  }


}
