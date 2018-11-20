import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Gtag } from 'angular-gtag';

import { LoginService } from './login.service';
import { MessageService } from '../message/message.service';

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
    private gtag: Gtag,
    private msgService: MessageService
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
      this.msgService.setMessage('Please input email!', -1);
      return false;
    }

    if (!password || password.length === 0) {
      this.msgService.setMessage('Please input password!', -1);
      return false;
    }

    if (password.length < 6) {
      this.msgService.setMessage('Password cannot be less than 6 characters!', -1);
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
            this.msgService.clearMessage();
          }
        )
        .catch( error => {
          console.log(error);
          this.router.navigate(['/login']);
          this.msgService.setMessage('Email or password is incorrect!', -1);
        });
  }

  sendEventToGoogleAnalytics() {
    this.gtag.event('mylogin', {
      'event_category': 'engagement',
      'event_label': 'logged in business card system successfully',
    });
  }
}
