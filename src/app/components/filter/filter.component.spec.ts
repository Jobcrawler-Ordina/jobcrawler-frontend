import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';

import { FilterComponent } from './filter.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { HttpService } from 'src/app/services/http.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { LoaderService } from 'src/app/services/loader.service';
import { of } from 'rxjs';
import { VacancyTableComponent } from '../vacancy-table/vacancy-table.component';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { By } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { mockSkills, noSkills, mockVacancies, mockCities } from 'src/app/tests/httpMockResponses';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { RouterTestingModule } from '@angular/router/testing';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldControl } from '@angular/material/form-field';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { delay, take, takeUntil } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

describe('FilterComponent', () => {
  let component: FilterComponent;
  let fixture: ComponentFixture<FilterComponent>;
  let httpService: HttpService;
  let httpMock: HttpTestingController;
  const formBuilder: FormBuilder = new FormBuilder();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        imports: [
          RouterTestingModule,
          BrowserAnimationsModule,
          HttpClientTestingModule,
          ReactiveFormsModule,
          MatIconModule,
          MatIconTestingModule,
          MatCardModule,
          MatAutocompleteModule,
          MatDividerModule,
          MatListModule,
          MatDatepickerModule,
          MatMomentDateModule,
          NgxMatSelectSearchModule,
          MatSelectModule,
          MatInputModule,
        ],
        providers: [
          { provide: FormBuilder, useValue: formBuilder },
          LoaderService,
          HttpService,
          { provide: MatDialog, useValue: {}},
          { provide: MAT_DIALOG_DATA, useValue: []},
          MatFormFieldControl,
          MatSelect
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
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  xit('should fill skills variable upon init', fakeAsync(() => {
    // Arrange
    const mockService = jasmine.createSpyObj('HttpService', ['findAllSkills', 'getByQuery']);
    const mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    const mockDialog = jasmine.createSpyObj('MatDialog', ['open']);
    const filterComp = new FilterComponent(new FormBuilder(), mockService, mockDialog, mockRouter);
    mockService.findAllSkills.and.returnValue(of(mockSkills));
    mockService.getByQuery.and.returnValue(of(null));

    // Expect nothing at this stage, as we still need to fill the variables
    expect(filterComp.skills).toBeUndefined();

    // Act
    filterComp.ngOnInit();
    tick();

    // Assert
    expect(mockService.findAllSkills).toHaveBeenCalledTimes(1);
    expect(mockService.getByQuery).toHaveBeenCalledTimes(1);
    expect(filterComp.skills.length).toBe(2);
  }));

  xit('should fill vacancies variable upon init', fakeAsync(() => {
    // Arrange
    const mockService = jasmine.createSpyObj('HttpService', ['findAllSkills', 'getByQuery']);
    const mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    const mockDialog = jasmine.createSpyObj('MatDialog', ['open']);
    const filterComp = new FilterComponent(new FormBuilder(), mockService, mockDialog, mockRouter);

    mockService.findAllSkills.and.returnValue(of(noSkills));
    mockService.getByQuery.and.returnValue(of(mockVacancies));

    // Expect nothing at this stage, as we still need to fill the variables
    expect(filterComp.vacancies).toEqual([]);

    // Act
    filterComp.ngOnInit();
    tick();

    // Assert
    expect(mockService.findAllSkills).toHaveBeenCalledTimes(1);
    expect(mockService.getByQuery).toHaveBeenCalledTimes(1);
    expect(filterComp.vacancies.length).toBe(3);
    for (let i = 0; i < filterComp.vacancies.length; i++) {
      expect(filterComp.vacancies[i].title).toBe('title ' + (i + 1));
    }
  }));

  it('should toggle isShow upon calling the function', () => {
    const currentStatus: boolean = component.isShow;
    if (currentStatus) {
        component.toggleDisplay();
        expect(component.isShow).toBe(false);
    } else {
        component.toggleDisplay();
        expect(component.isShow).toBe(true);
    }
  });

  describe('DOM tests', () => {
    beforeEach(() => {
        // Arrange, setting up page with variables ourselves
        component.pageSize = 10;
        component.totalVacancies = 3;
        component.showForm = true;
        component.isShow = false;
        component.searchForm = formBuilder.group({
          keyword: '',
          city: '',
          distance: '',
          skills: '',
          fromDate: '',
          toDate: ''
        });

        httpMock = TestBed.inject(HttpTestingController);
        httpService = TestBed.inject(HttpService);

        httpService.findAllSkills().subscribe((data: any) => {
        component.skills = [];
        data._embedded.skills.forEach(d => {
          component.skills.push({
            href: d._links.self.href,
            name: d.name
            });
          });
        expect(component.skills.length).toBe(2);

        // load the initial bank list
        component.filteredSkillsMulti.next(component.skills.slice());

        // listen for search field value changes
        component.skillMultiFilterCtrl.valueChanges
          .pipe(takeUntil(component.onDestroy))
          .subscribe(() => {
            component.filterSkillsMulti();
          });
        });

        const req = httpMock.expectOne(environment.api + '/skills');
        expect(req.request.method).toEqual('GET');
        req.flush(mockSkills);
    });

    xit('should show skills in the filter column', async (done) => {
        component.filteredSkillsMulti
        .pipe(
          take(1),
          delay(1)
        )
        .subscribe(() => {
          // when the filtered skills are initialized
          fixture.detectChanges();
          component.multiSelect.open();
          fixture.detectChanges();

          component.multiSelect.openedChange
            .pipe(
              take(1),
              delay(1)
            )
            .subscribe((opened) => {
              expect(opened).toBe(true);
              const searchField = document.querySelector('.mat-select-search-inner .mat-select-search-input');
              const searchInner = document.querySelector('.mat-select-search-inner');
              expect(searchInner).toBeTruthy();
              expect(searchField).toBeTruthy();
              // check focus
              expect(searchField).toBe(document.activeElement);

              const optionElements = document.querySelectorAll('mat-option#skills');
              expect(component.multiSelect.options.length).toBe(3); // Includes mat-option as searchbar. Skills + 1
              expect(optionElements.length).toBe(2);

              done();
            });

        });
    });

    xit('should show default cities in city input', () => {
        // Arrange
        component.skills = [];
        component.locations = [];
        component.locations = mockCities;
        component.filteredLocations = of(component.locations);

        // Act, load page with above settings
        fixture.detectChanges();
        const inputElement = fixture.debugElement.query(By.css('#citySearch'));
        inputElement.nativeElement.dispatchEvent(new Event('focusin'));
        const matOptions = document.querySelectorAll('mat-option#city');

        // Assert
        expect(matOptions.length).toBe(component.locations.length);
        for (let i = 0; i < matOptions.length; i++) {
            expect(matOptions[i].textContent.trim()).toBe(component.locations[i]);
        }
    });

    xit('should filter cities based on text input', async () => {
        // Arrange
        component.skills = [];
        component.locations = [];
        component.locations = mockCities;
        component.filteredLocations = of(component.locations);
        component.resetForm();

        // Act
        fixture.detectChanges();
        const inputElement = fixture.debugElement.query(By.css('#citySearch'));
        inputElement.nativeElement.dispatchEvent(new Event('focusin'));

        // Enter first 3 chars from first element of mockCities array into our input field.
        inputElement.nativeElement.value = mockCities[0].substr(0, 3);
        inputElement.nativeElement.dispatchEvent(new Event('input'));

        await fixture.whenStable();
        fixture.detectChanges();

        const matOptions = document.querySelectorAll('mat-option#city');
        expect(matOptions.length).toBe(1); // Only one city out of the 4 that matches with 'Ams'.

        const optionToClick = matOptions[0] as HTMLElement;
        optionToClick.click();

        fixture.detectChanges();

        // Final assert. Input value should be equal to first city in cities array.
        expect(fixture.debugElement.query(By.css('#citySearch')).properties.value).toBe(mockCities[0]);
    });

  });

  afterEach(() => {
    fixture.destroy();
  });

});
