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
import { mockSkills, noSkills, mockVacancies } from 'src/app/tests/constants';

describe('FilterComponent', () => {
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

  beforeEach(() => {
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

    // Expect nothing at this stage, as we still need to fill the variables
    expect(filterComp.skills).toBeUndefined;

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

    mockService.findAllSkills.and.returnValue(of(noSkills));
    mockService.getByQuery.and.returnValue(of(mockVacancies));

    // Expect nothing at this stage, as we still need to fill the variables
    expect(filterComp.vacancies).toBeUndefined;

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

  describe('DOM tests', () => {
    beforeEach(() => {
        // Arrange, setting up page with variables ourselves
        component.pageSize = 10;
        component.totalVacancies = 3;
        component.showForm = true;
        component.isShow = false;
    });

    it('should show skills in the filter column', async() => {
        // Arange
        component.skills = [];
        mockSkills._embedded.skills.forEach(d => {
        component.skills.push(d.name);
        });
        component.filteredSkillsMulti.next(component.skills.slice());

        // Act, load page with above settings
        await fixture.whenStable();
        fixture.detectChanges();
        const debugElement = fixture.debugElement;
        const skillSelectElementAngular = debugElement.query(By.css('#mat-option-1')).query(By.css('.mat-option-text')).context.value;
        const skillSelectElementJava = debugElement.query(By.css('#mat-option-2')).query(By.css('.mat-option-text')).context.value;
        
        // Assert
        expect(skillSelectElementAngular).toBe(mockSkills._embedded.skills[0].name);
        expect(skillSelectElementJava).toBe(mockSkills._embedded.skills[1].name);
    });

    it('should show default cities in city input', () => {
        // Arrange
        component.skills = [];
        component.cities = [];
        component.cities = ['Amsterdam', 'Den Haag', 'Rotterdam', 'Utrecht'];
        component.filteredCities = of(component.cities);

        // Act, load page with above settings
        fixture.detectChanges();
        const inputElement = fixture.debugElement.query(By.css('#citySearch'));
        inputElement.nativeElement.dispatchEvent(new Event('focusin'));
        const matOptions = document.querySelectorAll('mat-option#city');

        // Assert
        expect(matOptions.length).toBe(component.cities.length);
        for(let i = 0; i < matOptions.length; i++) {
            expect(matOptions[i].textContent.trim()).toBe(component.cities[i]);
        }
    });

  });

  afterEach(() => {
    fixture.destroy();
  });

});