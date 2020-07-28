import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {VacancyTableComponent} from './vacancy-table.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatTableModule } from '@angular/material/table';
import { ConvertStringToDotsPipe } from 'src/app/utils/convert-string-to-dots.pipe';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';

describe('VacancyTableComponent', () => {
  let component: VacancyTableComponent;
  let fixture: ComponentFixture<VacancyTableComponent>;
  let nativeComponent: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ 
        HttpClientTestingModule,
        MatTableModule,
        MatCardModule
      ],
      declarations: [ 
        VacancyTableComponent,
        ConvertStringToDotsPipe
      ],
      providers: [
        { provide: MatDialog, useValue: {}},
        { provide: MAT_DIALOG_DATA, useValue: []}
      ]
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

    component.vacancies = [
      {
          url: '1',
          title: 'vacancy one',
          broker: 'broker',
          postingDate: 'date',
          location: 'location',
          vacancyUrl: 'url'
      },
      {
          url: '2',
          title: 'vacancy two',
          broker: 'broker',
          postingDate: 'date',
          location: 'location',
          vacancyUrl: 'url'
      },
      {
          url: '3',
          title: 'vacancy three',
          broker: 'broker',
          postingDate: 'date',
          location: 'location',
          vacancyUrl: 'url'
      }
    ];

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
});