import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../auth.service';
import {Router} from '@angular/router';
import {catchError} from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
loginForm: FormGroup;
errorMessage;
  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }
  // tslint:disable-next-line:typedef
  get email(){
    return this.loginForm.get('email');
  }
  // tslint:disable-next-line:typedef
  get password(){
    return this.loginForm.get('password');
  }
// tslint:disable-next-line:typedef
onLogin(){
    this.authService.onLoginUser(this.loginForm.value).subscribe(res => {
      console.log(res.data);
      localStorage.setItem('token', res.token);
      localStorage.setItem('email', res.email);
      this.router.navigateByUrl('home');
    },
    err => {
      this.errorMessage = 'Invalid Email or Password';
    });
}
}
