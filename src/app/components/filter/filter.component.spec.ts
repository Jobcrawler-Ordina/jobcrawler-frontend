import { async, ComponentFixture, TestBed } from '@angular/core/testing';

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
import { mockSkills, mockLocations } from 'src/app/tests/httpMockResponses';
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
import { MatPaginatorModule } from '@angular/material/paginator';
import { NavigatorService } from 'src/app/services/navigator.service';
import { Location } from 'src/app/models/location';

describe('FilterComponent', () => {
  let component: FilterComponent;
  let fixture: ComponentFixture<FilterComponent>;
  let httpService: HttpService;
  let httpMock: HttpTestingController;
  const formBuilder: FormBuilder = new FormBuilder();
  const navigatorSpy = jasmine.createSpyObj('NavigatorService', ['getLocation']);
  let findAllSkillsSpy;
  let getByQuerySpy;
  let getLocationsSpy;
  let getCoordinatesSpy;
  let getLocationByCoordinatesSpy;

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
          MatPaginatorModule
        ],
        providers: [
          { provide: FormBuilder, useValue: formBuilder },
          LoaderService,
          HttpService,
          { provide: NavigatorService, useValue: navigatorSpy },
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
    navigatorSpy.getLocation.and.returnValue(Promise.resolve({ coords: { latitude: 5.748, longitude: 52.500, altitude: null,
      accuracy: 1866, altitudeAccuracy: null, heading: null, speed: null }, timestamp: 0 }));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('should fill upon init', () => {
    beforeEach(() => {
      httpService = TestBed.inject(HttpService);
      findAllSkillsSpy = spyOn(httpService, 'findAllSkills').and.returnValue(of(mockSkills));
      getByQuerySpy = spyOn(httpService, 'getByQuery').and.returnValue(of({ totalItems: 20, totalPages: 10,
        currentPage: 0, vacancies: [] }));
      getLocationsSpy = spyOn(httpService, 'getLocations').and.returnValue(mockLocations);
      getCoordinatesSpy = spyOn(httpService, 'getCoordinates').and.returnValue(Promise.resolve([5.748, 52.500]));
      getLocationByCoordinatesSpy = spyOn(httpService, 'getLocationByCoordinates').and.returnValue(of({ location: 'Amsterdam' }));
    });

    it('should have 2 skills after initalization', () => {
      expect(component.skills).toBeUndefined();
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(findAllSkillsSpy).toHaveBeenCalledTimes(1);
        expect(getLocationsSpy).toHaveBeenCalledTimes(1);
        expect(getLocationByCoordinatesSpy).toHaveBeenCalledTimes(1);
        expect(getByQuerySpy).toHaveBeenCalledTimes(1);
        expect(component.skills.length).toBe(2);
      });
    });

    it('should fill vacancies variable', () => {
      expect(component.vacancies).toEqual([]);
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(findAllSkillsSpy).toHaveBeenCalledTimes(1);
        expect(getByQuerySpy).toHaveBeenCalledTimes(1);
        expect(component.vacancies.length).toBe(3);
        for (let i = 0; i < component.vacancies.length; i++) {
          expect(component.vacancies[i].title).toBe('title ' + (i + 1));
        }
      });
    });

    it('should set the home location', () => {
      expect(component.homeLocation).toBeUndefined();
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        const location = new Location('Amsterdam', 5.478, 52.500);
        expect(component.homeLocation).toEqual(location);
        expect(getLocationByCoordinatesSpy).toHaveBeenCalledWith([5.478, 52.500]);
      });
    });

  });

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
          location: '',
          distance: '',
          skills: '',
          fromDate: '',
          toDate: ''
        });

        httpMock = TestBed.inject(HttpTestingController);
        httpService = TestBed.inject(HttpService);

        httpService.findAllSkills().subscribe((data: any) => {
        component.skills = [];
        data._embedded.skills.forEach((d: any) => {
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

    it('should show skills in the filter column', async (done) => {
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

    it('should show default cities in city input', () => {
        // Arrange
        component.skills = [];
        component.locations = [];
        component.locations = mockLocations;
        component.filteredLocations = of(component.locations);

        // Act, load page with above settings
        fixture.detectChanges();
        const inputElement = fixture.debugElement.query(By.css('#locationSearch'));
        inputElement.nativeElement.dispatchEvent(new Event('focusin'));
        const matOptions = document.querySelectorAll('mat-option#city');

        // Assert
        expect(matOptions.length).toBe(component.locations.length);
        for (let i = 0; i < matOptions.length; i++) {
            expect(matOptions[i].textContent.trim()).toBe(component.locations[i]);
        }
    });

    it('should filter cities based on text input', async () => {
        // Arrange
        component.skills = [];
        component.locations = mockLocations;
        component.filteredLocations = of(component.locations);
        component.resetForm();

        // Act
        fixture.detectChanges();
        component.locations = mockLocations;
        const inputElement = fixture.debugElement.query(By.css('#locationSearch'));
        inputElement.nativeElement.dispatchEvent(new Event('focusin'));

        // Enter first 3 chars from first element of mockCities array into our input field.
        inputElement.nativeElement.value = mockLocations[0].substr(0, 3);
        inputElement.nativeElement.dispatchEvent(new Event('input'));

        await fixture.whenStable();
        fixture.detectChanges();

        const matOptions = document.querySelectorAll('mat-option#location');
        expect(matOptions.length).toBe(1); // Only one city out of the 4 that matches with 'Ams'.
    });

  });

  afterEach(() => {
    fixture.destroy();
  });

});
