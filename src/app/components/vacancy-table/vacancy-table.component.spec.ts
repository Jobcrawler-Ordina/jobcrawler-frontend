import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {VacancyTableComponent} from './vacancy-table.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ConvertStringToDotsPipe } from 'src/app/utils/convert-string-to-dots.pipe';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { mockVacancies } from 'src/app/tests/httpMockResponses';
import { MaterialModule } from 'src/app/material/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('VacancyTableComponent', () => {
  let component: VacancyTableComponent;
  let fixture: ComponentFixture<VacancyTableComponent>;
  let nativeComponent: HTMLElement;
  let dialog: jasmine.SpyObj<MatDialog>;

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
        { provide: MatDialog, useValue: jasmine.createSpyObj<MatDialog>(['open']) },
        { provide: MAT_DIALOG_DATA, useValue: [] }
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VacancyTableComponent);
    // component = fixture.debugElement.children[0].componentInstance;
    component = fixture.componentInstance;
    nativeComponent = fixture.debugElement.nativeElement;
    component.isShow = true;
    component.vacancies = [];
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit when the hide/show filter column button is clicked', () => {
    spyOn(component.filterButtonClicked, 'emit');
    component.resizeFilterClick();
    expect(component.filterButtonClicked.emit).toHaveBeenCalled();
  });

  it('should show a message that no vacancies are found', () => {
    fixture.detectChanges();
    const element = fixture.debugElement.query(By.css('#noVacanciesMessage')).nativeElement;
    expect(element.textContent).toBe('No vacancies that match your filter criteria.');
  });

  describe('Filled table', () => {
    beforeEach(() => {
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
      dialog = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
      fixture.detectChanges();
    });

    it('should show all vacancies on initialization', async(() => {
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

    it('should open matDialog upon clicking vacancy title', () => {
      spyOn(component, 'openDialog');
      const firstVacancyTitleElement = fixture.debugElement.nativeElement.querySelector('a.pointer');
      firstVacancyTitleElement.click();
      expect(component.openDialog).toHaveBeenCalledWith(component.vacancies[0].id);
    });

    it('should change class when isShow changed', () => {
      component.isShow = false;
      component.ngOnChanges();
      fixture.detectChanges();
      const elementFalse = fixture.debugElement.query(By.css('#tableDiv')).nativeElement;
      expect(elementFalse.classList).toContain('table-container-no-filter');

      component.isShow = true;
      component.ngOnChanges();
      fixture.detectChanges();
      const elementTrue = fixture.debugElement.query(By.css('#tableDiv')).nativeElement;
      expect(elementTrue.classList).toContain('table-container');
    });

    it('should open', () => {
      component.openDialog('0');
      expect(dialog.open.calls.count()).toBe(1);
    });
  });


  afterEach(() => {
    fixture.destroy();
  });
});
