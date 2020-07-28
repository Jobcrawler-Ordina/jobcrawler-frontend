import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterComponent } from './filter.component';
import { HttpService } from 'src/app/services/http.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { VacancyTableComponent } from '../vacancy-table/vacancy-table.component';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { LoaderService } from 'src/app/services/loader.service';

describe('FilterComponent', () => {

  let httpTestingController: HttpTestingController;

  let component: FilterComponent;
  let fixture: ComponentFixture<FilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        MatAutocompleteModule
      ],
      providers: [
        FormBuilder,
        HttpService,
        LoaderService,
        { provide: MatDialog, useValue: {}},
        { provide: MAT_DIALOG_DATA, useValue: []}
      ],
      declarations: [
        FilterComponent,
        VacancyTableComponent
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    httpTestingController = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(FilterComponent);
    component = fixture.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get all vacancies on initialization', () => {
    // This test should be added in filter.component.ts as we request the vacancies in that class?
      // Create mock for vacancies http request
      const vacanciesUrl = 'http://localhost:8080/searchrequest';
      const mockVacancies = {
          queries: [null, null, null],
          vacancies: [
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
          ]
      };

      // Expect search request to not be triggered yet
      httpTestingController.expectNone(vacanciesUrl);
      expect(component.vacancies.length).toEqual(0);

      // Initialize component
      fixture.detectChanges();

      // Expect one search request that should be a POST
      const req = httpTestingController.expectOne(vacanciesUrl);
      expect(req.request.method).toEqual('POST');

      // Respond to search request with mock data
      req.flush(mockVacancies);

      // Expect stored vacancies to now match the mock data
      expect(component.vacancies.length).toEqual(3);
      expect(component.vacancies[0].title).toEqual(mockVacancies.vacancies[0].title);
  });
});
