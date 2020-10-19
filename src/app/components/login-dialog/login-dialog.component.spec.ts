import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginDialogComponent } from './login-dialog.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MaterialModule } from 'src/app/material/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Router } from '@angular/router';
import { loginMockResponse } from 'src/app/tests/authenticationServiceMockResponses';
import { allowRegistrationMock } from 'src/app/tests/adminServiceMockResponses';
import { BehaviorSubject, of, Observable } from 'rxjs';
import { User } from 'src/app/models/user.model';

describe('LoginDialogComponent', () => {
  let component: LoginDialogComponent;
  let fixture: ComponentFixture<LoginDialogComponent>;
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
});
