import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {VacancyTableComponent} from './vacancy-table.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatTableModule } from '@angular/material/table';
import { ConvertStringToDotsPipe } from 'src/app/utils/convert-string-to-dots.pipe';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { mockVacancies } from 'src/app/tests/constants';
import { MaterialModule } from 'src/app/material/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('VacancyTableComponent', () => {
  let component: VacancyTableComponent;
  let fixture: ComponentFixture<VacancyTableComponent>;
  let nativeComponent: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ 
        BrowserAnimationsModule,
        HttpClientTestingModule,
        MaterialModule
      ],
      declarations: [ 
        VacancyTableComponent,
        ConvertStringToDotsPipe
      ],
      providers: [
        { provide: MatDialog, useValue: {}},
        { provide: MAT_DIALOG_DATA, useValue: []}
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VacancyTableComponent);
    component = fixture.debugElement.children[0].componentInstance;
    nativeComponent = fixture.debugElement.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show all vacancies on initialization', async(() => {
    component.vacancies = [];
    mockVacancies.vacancies.forEach((vacancy: any) => {
      component.vacancies.push({
          title: vacancy.title,
          broker: vacancy.broker,
          postingDate: vacancy.postingDate,
          location: vacancy.location,
          id: vacancy.id,
          vacancyUrl: vacancy.vacancyURL
      });
    });

    fixture.detectChanges();
      
    // Expect stored vacancies to now match the mock data
    expect(component.vacancies.length).toEqual(3);
    expect(component.vacancies[0].title).toEqual(fixture.componentInstance.vacancies[0].title);

    // Expect vacancies to be shown only after component has detected changes
    const vacanciesTable = nativeComponent.querySelector('table');

    const vacancyTitles = vacanciesTable.children[1].children;
    expect(vacanciesTable).toBeTruthy();
    expect(vacancyTitles.length).toEqual(fixture.componentInstance.vacancies.length);
    expect(vacancyTitles[0].firstChild.textContent.trim()).toEqual(fixture.componentInstance.vacancies[0].title);
  }));

  afterEach(() => {
    fixture.destroy();
  });
});