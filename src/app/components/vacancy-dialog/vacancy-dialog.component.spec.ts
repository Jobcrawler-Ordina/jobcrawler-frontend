import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { VacancyDialogComponent } from './vacancy-dialog.component';
import { MatDialog, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Vacancy } from 'src/app/models/vacancy';
import { HttpService } from 'src/app/services/http.service';
import { Component, NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatListModule } from '@angular/material/list';
import { environment } from 'src/environments/environment';
import { mockSkills, mockVacancy } from 'src/app/tests/httpMockResponses';
import { of, throwError } from 'rxjs';

describe('VacancyDialogComponent', () => {
  let dialog: MatDialog;
  let component: VacancyDialogComponent;
  let fixture: ComponentFixture<VacancyDialogComponent>;
  let nativeComponent: HTMLElement;
  let httpService: HttpService;
  let httpMock: HttpTestingController;
  let overlayContainerElement: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        HttpClientTestingModule,
        DialogTestModule,
        MatListModule
      ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: ['1']},
        HttpService,
        { provide: OverlayContainer, useFactory: () => {
          overlayContainerElement = document.createElement('div');
          return { getContainerElement: () => overlayContainerElement };
        }}
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    httpService = TestBed.inject(HttpService);
    httpMock = TestBed.inject(HttpTestingController);
    dialog = TestBed.inject(MatDialog);
    fixture = TestBed.createComponent(VacancyDialogComponent);
    component = fixture.componentInstance;
    nativeComponent = fixture.debugElement.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get vacancy data and display it', () => {

    httpService.getByID('0').subscribe((vacancy: Vacancy) => {
      component.vacancy = vacancy;
    });

    const req = httpMock.expectOne(environment.api + '/vacancies/0');
    expect(req.request.method).toEqual('GET');
    req.flush(mockVacancy);

    component.getVacancyDetails('0');
    fixture.detectChanges();

    expect(component.vacancy).toBe(mockVacancy);

      // Initialize component
    const config = {
        data: '0'
      };
    dialog.open(VacancyDialogComponent, config);
    component.vacancy = mockVacancy;

    fixture.detectChanges();

      // Expect stored id and vacancy to now match the mock data
    // expect(component.vacancyID).toEqual(component.vacancy.id);
    expect(component.vacancy.id).toEqual(mockVacancy.id);
    expect(component.vacancy.title).toEqual(mockVacancy.title);

      // Expect vacancy to be shown
    const vacancyElement = nativeComponent.querySelector('#vacancy');
    const vacancyData = nativeComponent.querySelector('#vacancy').children[1].children;

    expect(vacancyElement).toBeTruthy();
    expect(vacancyData.length).toEqual(10);
    expect(vacancyData[0].textContent.trim()).toEqual('ID ' + mockVacancy.id);
    expect(vacancyData[2].textContent.trim()).toEqual('Title ' + mockVacancy.title);
  });

  it('should store both http request from getVacancyDetails in a forkJoin array', () => {
    const service = fixture.debugElement.injector.get(HttpService);
    spyOn(service, 'getByID').and.returnValue(of(mockVacancy));
    spyOn(service, 'getSkillsForVacancy').and.returnValue(of(mockSkills));
    expect(component).toBeTruthy();
    fixture.detectChanges();
    component.getVacancyDetails('0');

    expect(component.vacancy).toBeDefined();
    expect(component.vacancy.skills.length).toEqual(2);
    expect(service.getByID).toHaveBeenCalled();
    expect(service.getSkillsForVacancy).toHaveBeenCalled();
  });

  it('should store both request in forkJoin array, but there are no skills available', () => {
    const service = fixture.debugElement.injector.get(HttpService);
    spyOn(service, 'getByID').and.returnValue(of(mockVacancy));
    spyOn(service, 'getSkillsForVacancy').and.returnValue(of({}));
    expect(component).toBeTruthy();
    fixture.detectChanges();
    component.getVacancyDetails('0');

    expect(component.vacancy).toBeDefined();
    expect(component.vacancy.skills.length).toEqual(0);
    expect(service.getByID).toHaveBeenCalled();
    expect(service.getSkillsForVacancy).toHaveBeenCalled();
  });

  it('should give an error when calling getVacancyDetails method', () => {
    const service = fixture.debugElement.injector.get(HttpService);
    spyOn(service, 'getByID').and.returnValue(of(mockVacancy));
    spyOn(service, 'getSkillsForVacancy').and.returnValue(throwError({ error: { message: 'Error' } }));
    expect(component).toBeTruthy();
    fixture.detectChanges();
    component.getVacancyDetails('0');

    expect(component.vacancy).toBeUndefined();
    expect(service.getByID).toHaveBeenCalled();
    expect(service.getSkillsForVacancy).toHaveBeenCalled();
    expect(component.errorMSG).toBe('Error');
  });

  it('should display error', () => {
    const vacancyErrorMock = 'Invalid ID';

    // Initialize component
    expect(component.errorMSG).toBeUndefined();
    fixture.detectChanges();

    // Expect error to be shown only after component has detected changes
    expect(nativeComponent.querySelector('p')).toBeNull();
    component.errorMSG = vacancyErrorMock;
    fixture.detectChanges();
    const errorText = nativeComponent.querySelector('p').textContent;
    expect(errorText).toEqual(vacancyErrorMock);
  });

  afterEach(() => {
    fixture.destroy();
  });

});

// DialogComponent is only a workaround to trigger change detection
@Component({
  template: ''
})
class DialogComponent {}

const TEST_DIRECTIVES = [
  VacancyDialogComponent,
  DialogComponent
];

@NgModule({
  imports: [MatDialogModule, BrowserAnimationsModule],
  exports: TEST_DIRECTIVES,
  declarations: TEST_DIRECTIVES,
  entryComponents: [
    VacancyDialogComponent
  ],
})
class DialogTestModule { }
