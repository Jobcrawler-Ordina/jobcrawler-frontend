import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';

import { FilterComponent } from './filter.component';
import { FormBuilder } from '@angular/forms';
import { HttpService } from 'src/app/services/http.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LoaderService } from 'src/app/services/loader.service';
import { of } from 'rxjs';
import { VacancyTableComponent } from '../vacancy-table/vacancy-table.component';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { By } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('FilterComponent', () => {
  let component: FilterComponent;
  let fixture: ComponentFixture<FilterComponent>;

  const mockSkills = {
    _embedded: {
      skills: [
        {
            name: "Angular"
        },
        {
            name: "Java"
        }
      ]
    }
  };

  const mockVacancies = {
      vacancies: [
        {
          id: "1",
          vacancyURL: "url",
          title: "title 1",
          broker: "Yacht",
          vacancyNumber: "1",
          hours: "40",
          location: "Amsterdam, Nederland",
          salary: "1234",
          postingDate: "21 april 2020",
          about: "vacancy 1",
          skills: []
        },
        {
          id: "2",
          vacancyURL: "url",
          title: "title 2",
          broker: "Huxley",
          vacancyNumber: "2",
          hours: "40",
          location: "Amsterdam, Nederland",
          salary: "2341",
          postingDate: "21 april 2020",
          about: "vacancy 2",
          skills: []
        },
        {
          id: "3",
          vacancyURL: "url",
          title: "title 3",
          broker: "Jobbird",
          vacancyNumber: "3",
          hours: "40",
          location: "Amsterdam, Nederland",
          salary: "2143",
          postingDate: "21 april 2020",
          about: "vacancy 3",
          skills: []
        }
      ]
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        imports: [
          HttpClientTestingModule,
          MatAutocompleteModule
        ],
        providers: [
          FormBuilder,
          { provide: HttpService, useValue: jasmine.createSpyObj('HttpService', ['findAllSkills', 'getByQuery']) },
          LoaderService,
          { provide: MatDialog, useValue: {}},
          { provide: MAT_DIALOG_DATA, useValue: []}
        ],
        declarations: [ 
          FilterComponent,
          VacancyTableComponent
        ],
        schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .compileComponents();
  }));

  let httpServiceMock: jasmine.SpyObj<HttpService>;

  beforeEach(() => {
    httpServiceMock = TestBed.get(HttpService);

    fixture = TestBed.createComponent(FilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fill skills variable upon init', fakeAsync(() => {
    // Arrange
    let mockService = jasmine.createSpyObj('HttpService', ['findAllSkills', 'getByQuery']);
    let filterComp = new FilterComponent(new FormBuilder, mockService, new LoaderService);

    mockService.findAllSkills.and.returnValue(of(mockSkills));
    mockService.getByQuery.and.returnValue(of(null));

    // Act
    filterComp.ngOnInit();
    tick();

    // Assert
    expect(mockService.findAllSkills).toHaveBeenCalledTimes(1);
    expect(mockService.getByQuery).toHaveBeenCalledTimes(1);
    expect(filterComp.skills.length).toBe(2);
  }));

  it('should fill vacancies variable upon init', fakeAsync(() => {
    // Arrange
    let mockService = jasmine.createSpyObj('HttpService', ['findAllSkills', 'getByQuery']);
    let filterComp = new FilterComponent(new FormBuilder, mockService, new LoaderService);

    const noSkills = {
      _embedded: {
          skills: []
      }
    };;

    mockService.findAllSkills.and.returnValue(of(noSkills));
    mockService.getByQuery.and.returnValue(of(mockVacancies));

    // Act
    filterComp.ngOnInit();
    tick();

    // Assert
    expect(mockService.findAllSkills).toHaveBeenCalledTimes(1);
    expect(mockService.getByQuery).toHaveBeenCalledTimes(1);
    expect(filterComp.vacancies.length).toBe(3);
    for(let i: number = 0; i < filterComp.vacancies.length; i++) {
      expect(filterComp.vacancies[i].title).toBe("title " + (i+1));
    }
  }));
});
