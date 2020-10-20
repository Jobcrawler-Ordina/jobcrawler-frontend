import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';

@Component({
  selector : 'app-login',
  templateUrl : './login-dialog.component.html',
  styleUrls : ['./login-dialog.component.scss'],
})
export class LoginDialogComponent implements OnInit, AfterViewInit {

  hide = true;
  hideP1 = true;
  hideP2 = true;
  loginForm: FormGroup;
  signupForm: FormGroup;
  minLengthPass = 6;
  minLengthUser = 3;
  errMSGsignup: string;
  successMSGsignup: string;
  errMSGlogin: string;
  allowRegistration = false;

  errorMessages = {
    usernameSignup : [
      { type: 'required', message: 'Username is required' },
      { type: 'minlength', message: 'Minimum length is ' + this.minLengthUser + ' chars' }
    ],
    passwordSignup : [
      { type: 'minlength', message: 'Minimum length is ' + this.minLengthPass + ' chars' },
      { type: 'required', message: 'Password is required' }
    ],
    passwordSignupConfirm: [
      { type: 'minlength', message: 'Minimum length is ' + this.minLengthPass + ' chars' },
      { type: 'required', message: 'Password is required' }
    ]
  };

  errorMessagesLogin = {
    username : [
      { type: 'required', message: 'Username is required' },
      { type: 'minlength', message: 'Minimum length is ' + this.minLengthUser + ' chars' }
    ],
    password : [
      { type: 'minlength', message: 'Minimum length is ' + this.minLengthPass + ' chars' },
      { type: 'required', message: 'Password is required' }
    ]
  };

  constructor(private fb: FormBuilder,
              private router: Router,
              private authenticationService: AuthenticationService) {
                if (this.authenticationService.currentUserValue) {
                  this.router.navigate(['/admin']);
                }
              }

  ngOnInit(): void {
    this.constructForms();
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.loadAllowSignup());
  }

  login(): void {
    this.errMSGlogin = null;
    const val = this.loginForm.value;
    this.authenticationService.login(val.username, val.password)
      .pipe(first())
      .subscribe(
        () => {
          this.router.navigate(['/admin']);
        },
        err => {
          this.errMSGlogin = err;
        }
      );
  }

  signup(): void {
    this.errMSGsignup = null;
    this.successMSGsignup = null;
    const val = this.signupForm.value;
    this.authenticationService.signup(val.usernameSignup, val.passwordSignup).subscribe((data: any) => {
      if (data.success) {
        this.successMSGsignup = `Registration successful.<br>
        An other admin need to give you permissions<br>
        before loggin in does something.`;
      }
    },
    err => {
      console.log(err);
      this.errMSGsignup = err;
    });
  }

  private loadAllowSignup(): void {
    this.authenticationService.allowRegistration().subscribe((data: any) => {
      this.allowRegistration = data.allow;
    });
  }

  private constructForms(): void {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(this.minLengthUser)]],
      password: ['',  [Validators.required, Validators.minLength(this.minLengthPass)]]
    });

    this.signupForm = this.fb.group({
      usernameSignup: ['', [Validators.required, Validators.minLength(this.minLengthUser)]],
      passwordSignup: ['', [Validators.required, Validators.minLength(this.minLengthPass)]],
      passwordSignupConfirm: ['', [Validators.required, Validators.minLength(this.minLengthPass)]]
    }, {
      validators: this.password.bind(this)
    });
  }

  private password(formgroup: FormGroup): object {
    const { value: password } = formgroup.get('passwordSignup');
    const { value: passwordConfirm } = formgroup.get('passwordSignupConfirm');
    if (password.length >= this.minLengthPass && passwordConfirm.length >= this.minLengthPass) {
      return password === passwordConfirm ? null : { passwordNotMatch: true };
    } else {
      return null;
    }
  }

}
