import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';

@Component({
  selector : 'app-login',
  templateUrl : './login-dialog.component.html',
  styleUrls : ['./login-dialog.component.scss'],
})
export class LoginDialogComponent implements OnInit {

  hide: boolean = true;
  hideP1: boolean = true;
  hideP2: boolean = true;
  loginForm: FormGroup;
  signupForm: FormGroup;
  minLengthPass: number = 6;
  minLengthUser: number = 3;
  errMSGsignup: string;
  successMSGsignup: string;
  errMSGlogin: string;

  error_messages = {
    'usernameSignup' : [
      { type: 'required', message: 'Username is required' },
      { type: 'minlength', message: 'Minimum length is ' + this.minLengthUser + ' chars' }
    ],
    'passwordSignup' : [
      { type: 'minlength', message: 'Minimum length is ' + this.minLengthPass + ' chars' },
      { type: 'required', message: 'Password is required' }
    ],
    'passwordSignupConfirm': [
      { type: 'minlength', message: 'Minimum length is ' + this.minLengthPass + ' chars' },
      { type: 'required', message: 'Password is required' }
    ]
  }

  error_messages_login = {
    'username' : [
      { type: 'required', message: 'Username is required' },
      { type: 'minlength', message: 'Minimum length is ' + this.minLengthUser + ' chars' }
    ],
    'password' : [
      { type: 'minlength', message: 'Minimum length is ' + this.minLengthPass + ' chars' },
      { type: 'required', message: 'Password is required' }
    ]
  }
  
  constructor(private fb: FormBuilder,
              private router: Router,
              private authenticationService: AuthenticationService) {
                if (this.authenticationService.currentUserValue) {
                  this.router.navigate(['/getskills']);
                }
              }
  
  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['',[Validators.required, Validators.minLength(this.minLengthUser)]],
      password: ['',[Validators.required, Validators.minLength(this.minLengthPass)]]
    });

    this.signupForm = this.fb.group({
      usernameSignup: ['',[Validators.required, Validators.minLength(this.minLengthUser)]],
      passwordSignup: ['',[Validators.required, Validators.minLength(this.minLengthPass)]],
      passwordSignupConfirm: ['',[Validators.required, Validators.minLength(this.minLengthPass)]]
    }, {
      validators: this.password.bind(this)
    });
  }

  login(): void {
    this.errMSGlogin = null;
    const val = this.loginForm.value;
    this.authenticationService.login(val.username, val.password)
      .pipe(first())
      .subscribe(
        () => {
          this.router.navigate(['/getskills']);
        },
        err => {
          this.errMSGlogin = err;
        }
      )
  }

  signup(): void {
    this.errMSGsignup = null;
    this.successMSGsignup = null;
    const val = this.signupForm.value;
    console.log(val);
    this.authenticationService.signup(val.usernameSignup, val.passwordSignup).subscribe((data: any) => {
      this.successMSGsignup = 'Registration successful.<br> An other admin need to give you permissions<br>before loggin in does something.';
    },
    err => {
      console.log(err);
      this.errMSGsignup = err.error;
    });
  }

  private password(formgroup: FormGroup) {
    const { value: password } = formgroup.get('passwordSignup');
    const { value: passwordConfirm } = formgroup.get('passwordSignupConfirm');
    if (password.length >= this.minLengthPass && passwordConfirm.length >= this.minLengthPass)
      return password === passwordConfirm ? null : { passwordNotMatch: true };
    else
      return null;
  }

}  
