import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { LoginDialogComponent } from './login-dialog.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MaterialModule } from 'src/app/material/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Router } from '@angular/router';
import { failSignupMockResponse, loginMockResponse, signupMockResponse } from 'src/app/tests/authenticationServiceMockResponses';
import { allowRegistrationMock } from 'src/app/tests/adminServiceMockResponses';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';

describe('LoginDialogComponent', () => {
  let component: LoginDialogComponent;
  let fixture: ComponentFixture<LoginDialogComponent>;
  let nativeComponent: HTMLElement;
  let authSpy;
  let routerSpy;

  beforeEach(async(() => {
    authSpy = jasmine.createSpyObj('AuthenticationService', ['login', 'signup', 'allowRegistration']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    authSpy.allowRegistration.and.returnValue(of(allowRegistrationMock));

    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        MaterialModule
      ],
      declarations: [ LoginDialogComponent ],
      providers: [
        FormBuilder,
        { provide: AuthenticationService, useValue: authSpy },
        { provide: Router, useValue: routerSpy }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    spyOn(AuthenticationService.prototype as any, 'allowRegistration').and.returnValue(of(allowRegistrationMock));

    fixture = TestBed.createComponent(LoginDialogComponent);
    component = fixture.componentInstance;
    nativeComponent = fixture.debugElement.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call the redirect method and redirect to /admin', () => {
    component.currentUser = loginMockResponse;

    component.redirect();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/admin']);
  });

  it('should call the redirect method and not redirect', () => {
    component.currentUser = null;

    component.redirect();

    expect(routerSpy.navigate).toHaveBeenCalledTimes(0);
  });

  it('should succesful login user and redirect to /admin', () => {
    authSpy.login.and.returnValue(of(loginMockResponse));
    component.loginForm.controls.username.setValue('Admin');
    component.loginForm.controls.password.setValue('password');
    fixture.detectChanges();
    const button = nativeComponent.querySelector('button');
    button.click();
    fixture.detectChanges();

    expect(authSpy.login).toHaveBeenCalledWith('Admin', 'password');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/admin']);
  });

  it('should not login user and not call the navigate method', () => {
    authSpy.login.and.returnValue(of());
    component.loginForm.controls.username.setValue('Admin');
    component.loginForm.controls.password.setValue('password');
    fixture.detectChanges();
    const button = nativeComponent.querySelector('button');
    button.click();
    fixture.detectChanges();

    expect(authSpy.login).toHaveBeenCalledWith('Admin', 'password');
    expect(routerSpy.navigate).toHaveBeenCalledTimes(0);
  });

  describe('Signup functionality', () => {
    it('should show 3 additional input fields after clicking on register', async(() => {
      const inputsBeforeClicking = nativeComponent.querySelectorAll('input');

      component.allowRegistration = true;
      fixture.detectChanges();
      const signUpTab = fixture.debugElement.queryAll(By.css('.mat-tab-label'))[1];
      signUpTab.triggerEventHandler('click', {});

      fixture.detectChanges();
      fixture.whenStable().then(() => {
          const inputsAfterClicking = nativeComponent.querySelectorAll('input');
          expect(inputsBeforeClicking.length).toBe(2);
          expect(inputsAfterClicking.length).toBe(5);
      });
    }));

    it('should mention that passwords do not match upon signing up', async(() => {
      component.allowRegistration = true;
      fixture.detectChanges();
      const signUpTab = fixture.debugElement.queryAll(By.css('.mat-tab-label'))[1];
      signUpTab.triggerEventHandler('click', {});
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(component.signupForm.errors).toBeNull();
        component.signupForm.controls.usernameSignup.setValue('Admin');
        component.signupForm.controls.passwordSignup.setValue('password');
        component.signupForm.controls.passwordSignupConfirm.setValue('otherpassword');
        fixture.detectChanges();
        expect(component.signupForm.errors.passwordNotMatch).toBeTrue();
      });
    }));

    describe('Signup submit', () => {

      beforeEach(() => {
        component.signupForm.controls.usernameSignup.setValue('Admin');
        component.signupForm.controls.passwordSignup.setValue('password');
        component.signupForm.controls.passwordSignupConfirm.setValue('password');
      });

      it('should succesfully register the user', () => {
        authSpy.signup.and.returnValue(of(signupMockResponse));
        component.signup();

        expect(authSpy.signup).toHaveBeenCalledWith('Admin', 'password');
        expect(component.successMSGsignup).toBeDefined();
        expect(component.errMSGsignup).toBeNull();
      });

      it('should not give a response without the success flag set to true', () => {
        authSpy.signup.and.returnValue(of({}));
        component.signup();

        expect(authSpy.signup).toHaveBeenCalledWith('Admin', 'password');
        expect(component.successMSGsignup).toBeNull();
        expect(component.errMSGsignup).toBeNull();
      });

      it('should give an error when trying to register', () => {
        authSpy.signup.and.returnValue(throwError(failSignupMockResponse));
        component.signup();

        expect(authSpy.signup).toHaveBeenCalledWith('Admin', 'password');
        expect(component.successMSGsignup).toBeNull();
        expect(component.errMSGsignup).toBeDefined();
      });
    });
  });
});
