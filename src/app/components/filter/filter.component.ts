import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { FilterQuery } from 'src/app/models/filterQuery.model';
import { IVacancies } from 'src/app/models/ivacancies';
import { FilterService } from 'src/app/services/filter.service';
import { Observable, Subject } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
  providers: [FilterService]
})
export class FilterComponent implements OnInit {

  isShow: boolean = false;
  searchForm: FormGroup;
  skills: string[] = ['Java', 'Spring', 'Angular', 'HTML', 'Postgres', 'Mockito', 'JUnit'];
  vacancies: IVacancies[] = [];
  cities: string[] = ['Amsterdam', 'Den Haag', 'Rotterdam', 'Utrecht'];
  filteredCities: Observable<String[]>;
  isLoading: Subject<boolean> = this.loaderService.isLoading;
  color = 'primary';
  mode = 'indeterminate';
  value = 50;

  constructor(private form: FormBuilder,
    private filterService: FilterService,
    private loaderService: LoaderService) { }

  ngOnInit(): void {
    this.searchForm = this.constructSearchForm();
    this.getAllVacancies();

    this.filteredCities = this.searchForm.get('city')!.valueChanges
    .pipe(
      startWith(''),
      map(value => this._filterCity(value))
    );
  }

  private _filterCity(search: string): string[] {
      return this.cities.filter(value => value.toLowerCase().indexOf(search.toLowerCase()) === 0);
  }

  toggleDisplay(): void {
    this.isShow = !this.isShow;
  }

  getAllVacancies(): void {
    this.filterService.showAllVacancies().subscribe((data: any) => {
      data.vacancies.forEach(vacancy => {
        this.vacancies.push({
            title: vacancy.title,
            broker: vacancy.broker,
            postingDate: vacancy.postingDate,
            location: vacancy.location,
            url: vacancy.id,
            vacancyUrl: vacancy.vacancyURL
        });
      });
    });
  }

  searchVacancies(): void {
    const filterQuery: FilterQuery = this.searchForm.value as FilterQuery;
    filterQuery.skills = filterQuery.skills.filter(a => a.selected == true).map(a => {
      return a.name;
    });

    if(!filterQuery.fromDate) filterQuery.fromDate = '';

    if(!filterQuery.toDate) filterQuery.toDate = '';

    console.log(filterQuery);

    this.getAllVacancies();

  }

  resetForm(): void {
    this.searchForm.reset(this.constructSearchForm().value);
    this.vacancies = [];
  }

  private constructSearchForm(): FormGroup {

    const buildSkills = () => {
      const arr = this.skills.map(skill => {
        return this.form.group({
          name: skill,
          selected: false
        });
      });
      return new FormArray(arr);
    }

    return this.form.group({
      city: '',
      skills: buildSkills(),
      distance: '',
      fromDate: '',
      toDate: ''
    });
  }

}
