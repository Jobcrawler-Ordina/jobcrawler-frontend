import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VacancyDialogComponent } from './vacancy-dialog.component';
import { MatDialog, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Vacancy } from 'src/app/models/vacancy';
import { HttpService } from 'src/app/services/http.service';
import { Component, NgModule } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';

describe('VacancyDialogComponent', () => {
  let dialog: MatDialog;
  let component: VacancyDialogComponent;
  let fixture: ComponentFixture<VacancyDialogComponent>;
  let nativeComponent: HTMLElement;
  let service;
  let overlayContainerElement: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule,
        DialogTestModule],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: ['1']},
        HttpService,
        { provide: OverlayContainer, useFactory: () => {
          overlayContainerElement = document.createElement('div');
          return { getContainerElement: () => overlayContainerElement };
        }}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    service = TestBed.get(HttpService);
    dialog = TestBed.get(MatDialog);
    fixture = TestBed.createComponent(VacancyDialogComponent);
    component = fixture.componentInstance;
    nativeComponent = fixture.debugElement.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get vacancy data and display it', () => {
      const vacancyMock: Vacancy = {
          id: component.vacancyID,
          title: 'Vacancy title',
          vacancyURL: 'google.com',
          broker: 'mockBroker',
          vacancyNumber: '123',
          hours: 40,
          location: 'Nieuwegein',
          postingDate: 'today',
          salaray: '',
          about: 'random',
          skills: []
      };

      expect(component.vacancy).toBeUndefined();

      // Initialize component
      const config = {
        data: '1'
      };
      dialog.open(VacancyDialogComponent, config);
      component.vacancy = vacancyMock;

      fixture.detectChanges();

      // Expect stored id and vacancy to now match the mock data
      expect(component.vacancyID).toEqual(component.vacancy.id);
      expect(component.vacancy.id).toEqual(vacancyMock.id);
      expect(component.vacancy.title).toEqual(vacancyMock.title);

      // Expect vacancy to be shown
      const vacancyElement = nativeComponent.querySelector('#vacancy');
      const vacancyData = nativeComponent.querySelector('#vacancy').children[1].children;

      expect(vacancyElement).toBeTruthy();
      expect(vacancyData.length).toEqual(10);
      expect(vacancyData[0].textContent.trim()).toEqual('ID ' + vacancyMock.id);
      expect(vacancyData[2].textContent.trim()).toEqual('Title ' + vacancyMock.title);
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
