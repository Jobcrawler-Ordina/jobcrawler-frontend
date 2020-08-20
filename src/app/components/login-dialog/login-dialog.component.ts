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
  loginForm: FormGroup;
  
  constructor(private fb: FormBuilder,
              private router: Router,
              private authenticationService: AuthenticationService) {
                if (this.authenticationService.currentUserValue) {
                  this.router.navigate(['/getskills']);
                }
              }
  
  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['',Validators.required],
      password: ['',Validators.required]
    });
  }

  login(): void {
    const val = this.loginForm.value;

    this.authenticationService.login(val.username, val.password)
      .pipe(first())
      .subscribe(
        data => {
          this.router.navigate(['/getskills']);
        }
      )
  }

}  
