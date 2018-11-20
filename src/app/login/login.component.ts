import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Gtag } from 'angular-gtag';

import { LoginService } from './login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email: string;
  password: string;
  
  constructor(
    private loginService: LoginService,
    private router: Router,
    private gtag: Gtag
  ) { }

  ngOnInit() {
  }

  onLoginEmail(): void {
    if (this.validateForm(this.email, this.password)) {
      this.emailLogin(this.email, this.password);
    }
  }

  validateForm(email: string, password: string): boolean {
    if (!email || email.length === 0) {
      return false;
    }

    if (!password || password.length === 0) {
      return false;
    }

    if (password.length < 6) {
      return false;
    }
    return true;
  }

  emailLogin(email: string, password: string) {
    this.loginService.loginWithEmail(this.email, this.password)
        .then(
          () => {
            this.sendEventToGoogleAnalytics();
            this.router.navigate(['/dashboard']);
          }
        )
        .catch( error => {
          console.log(error);
          this.router.navigate(['/login']);
        });
  }

  sendEventToGoogleAnalytics() {
    this.gtag.event('mylogin', {
      'event_category': 'engagement',
      'event_label': 'logged in business card system successfully',
    });
  }
}
