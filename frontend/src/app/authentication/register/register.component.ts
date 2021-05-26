import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }
  // tslint:disable-next-line:typedef
  get fname(){
    return this.registerForm.get('first_name');
  }
  // tslint:disable-next-line:typedef
  get lname(){
    return this.registerForm.get('last_name');
  }
  // tslint:disable-next-line:typedef
  get email(){
    return this.registerForm.get('email');
  }
  // tslint:disable-next-line:typedef
  get password(){
    return this.registerForm.get('password');
  }
  // tslint:disable-next-line:typedef
  onCreateUser(){
   this.authService.onCreateUser(this.registerForm.value).subscribe(res => {
     localStorage.setItem('token', res.token);
     this.router.navigateByUrl('/login');
     console.log(res);
   });
  }
}
