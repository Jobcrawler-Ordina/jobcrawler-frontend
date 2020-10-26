import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { FilterQuery } from 'src/app/models/filterQuery.model';
import { IVacancies } from 'src/app/models/ivacancies';
import { HttpService } from 'src/app/services/http.service';
import { Observable, Subject, ReplaySubject } from 'rxjs';
import { map, startWith, takeUntil } from 'rxjs/operators';
import { MatSelect } from '@angular/material/select';
import { PageEvent } from '@angular/material/paginator';
import { PageResult } from 'src/app/models/pageresult.model';
import { Vacancy } from 'src/app/models/vacancy';
import { Skill } from 'src/app/models/skill';
import { Sort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { LoginDialogComponent } from '../login-dialog/login-dialog.component';
import { Router } from '@angular/router';
import { Location } from 'src/app/models/location';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
  providers: [HttpService]
})
export class FilterComponent implements OnInit, OnDestroy {

  isShow = false;
  searchForm: FormGroup;
  skills: Skill[];
  vacancies: IVacancies[] = [];
  locations: string[];
  filteredLocations: Observable<string[]>;
  homeLocation: Location;
  distance: number;

  showForm = false;
  totalVacancies: number;
  pageSize = 15;
  currentPage: number;
  pageEvent: PageEvent;

  sort: Sort;
  sortBy = 'postingDate';
  sortOrder = 'desc';

  public skillMultiCtrl: FormControl = new FormControl();
  public skillMultiFilterCtrl: FormControl = new FormControl();
  public filteredSkillsMulti: ReplaySubject<Skill[]> = new ReplaySubject<Skill[]>(1);
  public onDestroy = new Subject<void>();
  @ViewChild('multiSelect', {static: false}) multiSelect: MatSelect;

  /**
   * Creates an instance of filter component.
   * @param form Constructs form
   * @param filterService Used for http requests (post/get)
   */
  constructor(private form: FormBuilder,
              private httpService: HttpService,
              private dialog: MatDialog,
              private router: Router
  ) {  }

  /**
   * Function gets executed upon initialization.
   * Constructs searchform.
   * Retrieves all vacancies.
   * Detect changes to 'location' field.
   */
  async ngOnInit(): Promise<void> {
      this.locations = this.httpService.getLocations();
      await this.loadForm(); // Need to load form fully before continuing with anything else that might causes errors
      this.getGeoLocation().then(result => this.homeLocation = result);
      this.searchVacancies(this.pageEvent);
  }

  /**
   * Destroys ngx-mat-select-search upon leaving page
   */
  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.complete();
  }

  /**
   * Toggles display / filter column
   */
  public toggleDisplay(): void {
    this.isShow = !this.isShow;
  }

/*    public toggleDisplayEmptyLocs(): void {
        this.showEmptyLocs = !this.showEmptyLocs;
    }*/

    private getGeoLocation(): Promise<any> {
        return new Promise((resolve) => {
            navigator.geolocation.getCurrentPosition((position) => {
                    this.httpService.getLocationByCoordinates(position.coords.latitude, position.coords.longitude)
                        .subscribe(
                            (data: any) => {
                              resolve(new Location(data.location, position.coords.longitude, position.coords.latitude));
                            },
                            () => {
                              resolve(new Location('', undefined, undefined));
                            },
                () => {
                    resolve(new Location('', undefined, undefined));
                });
        });
    });
    }

  public async searchVacancies(pageEvent?: PageEvent): Promise<void> {

    if (pageEvent !== undefined) {
        this.pageEvent = pageEvent;
    }

    let filterQuery: FilterQuery;
    let refLocation: Location = new Location('', undefined, undefined);

    if (this.searchForm !== undefined) {
      if (this.searchForm.get('location').value !== '') {
          refLocation = new Location(this.searchForm.get('location').value);
          await refLocation.setCoord(await this.httpService.getCoordinates(refLocation.name) as number[]);
      }
      this.distance = this.searchForm.get('distance').value;
      filterQuery = this.searchForm.value as FilterQuery;

      if (this.skillMultiCtrl.value !== null) {
        filterQuery.skills = [];
        this.skillMultiCtrl.value.forEach((skill: Skill) => {
          filterQuery.skills.push(skill.name);
        });
      } else {
        filterQuery.skills = [];
      }

      if (!filterQuery.fromDate) {
        filterQuery.fromDate = '';
      }

      if (!filterQuery.toDate) {
        filterQuery.toDate = '';
      }
    } else {
      this.isShow = true;
      filterQuery = new FilterQuery();
      filterQuery.location = '';
      filterQuery.distance = 0;
      filterQuery.fromDate = '';
      filterQuery.toDate = '';
      filterQuery.keyword = '';
      filterQuery.skills = [];
    }

    const pageNum = pageEvent ? pageEvent.pageIndex : 0;
    if (pageEvent) {
      this.pageSize = pageEvent.pageSize;
    }

    this.vacancies = [];
    this.httpService.getByQuery(filterQuery, pageNum, this.pageSize, this.sort)
    .pipe(takeUntil(this.onDestroy))
    .subscribe(async (page: PageResult) => {
        if (page !== null) {
        const tempVacancies: IVacancies[] = [];
        for (const vacancy of page.vacancies) {
            if (vacancy.location && refLocation.name !== '') {
                await this.httpService.getDistance(refLocation.getCoord(), [vacancy.location.lon, vacancy.location.lat])
                    .then((result: number) => {
                        vacancy.location.distance = result;
                    });
            }
            tempVacancies.push({
                title: vacancy.title,
                broker: vacancy.broker,
                postingDate: vacancy.postingDate,
                location: vacancy.location,
                id: vacancy.id,
                vacancyUrl: vacancy.vacancyURL
            });
        }
        this.vacancies = tempVacancies;
        this.totalVacancies = page.totalItems;
        this.currentPage = pageNum;
        if (this.sort !== undefined) {
          this.sortBy = this.sort.active;
          this.sortOrder = this.sort.direction;
        }
      } else {
        this.totalVacancies = 0;
        this.currentPage = 0;
      }
    });
  }

  /**
   * Resets form back to default values
   */
  public resetForm(): void {
    this.searchForm.reset(this.constructSearchForm());
    this.skillMultiCtrl.reset();
  }

  /**
   * Easily search and select skills
   * @returns Does not return anything, prevent method to continue
   */
  public filterSkillsMulti(): any {
    if (!this.skills) {
      return;
    }

    let search = this.skillMultiFilterCtrl.value;
    if (!search) {
      this.filteredSkillsMulti.next(this.skills.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredSkillsMulti.next(
      this.skills.filter(skill => skill.name.toLowerCase().indexOf(search) === 0)
    );
  }


  /**
   * Opens login dialog
   */
  public openLoginDialog(): void {
    const dialogRef = this.dialog.open(LoginDialogComponent);
    this.router.events
    .subscribe(() => {
      dialogRef.close();
    });
  }


  /**
   * Changes sorting with current search criteria
   * @param sort column/order
   */
  public changeSorting(sort: Sort) {
    this.sort = sort;
    this.searchVacancies(this.pageEvent);
  }


  /**
   * Loads form asynchronous
   */
  private loadForm(): Promise<any> {
    return new Promise((resolve) => {
      this.getSkills().then((data: any) => {
              const skillData: Skill[] = [];
              data._embedded.skills.forEach((skill: any) => {
                  skillData.push({
                      href: skill._links.self.href,
                      name: skill.name
                  });
              });
              this.skills = skillData;
              this.filteredSkillsMulti.next(this.skills.slice());
              this.constructSearchForm().then(() => {
                  this.showForm = true;
                  this.isShow = false;
                  resolve();
              });
          },
          err => {
              console.log('Failed loading form');
              console.log(err.message);
              resolve();
          });
        });
  }


  /**
   * Gets skills
   * @returns skills as Promise
   */
  private getSkills(): Promise<any> {
    return this.httpService.findAllSkills().toPromise();
  }


  /**
   * Filters location
   * @param search entered string
   * @returns matching locations to entered string
   */
  private _filterLocation(search: string): string[] {
    return this.locations.filter(value => value.toLowerCase().indexOf(search.toLowerCase()) === 0);
  }

  /**
   * Constructs search form
   * @returns empty search form
   */
  private constructSearchForm(): Promise<any> {
    return new Promise((resolve) => {
      this.searchForm = this.form.group({
        keyword: '',
        location: '',
        skills: '',
        distance: '',
        fromDate: '',
        toDate: ''
      }, { validator: this.dateLessThan('fromDate', 'toDate') });

      this.filteredLocations = this.searchForm.get('location')!.valueChanges
        .pipe(
          startWith(''),
          map(value => this._filterLocation(value || ''))
        );

      this.skillMultiFilterCtrl.valueChanges
      .pipe(takeUntil(this.onDestroy))
      .subscribe(() => {
        this.filterSkillsMulti();
      });

      resolve();
    });
  }
    dateLessThan(from: string, to: string) {
        return (group: FormGroup): { [key: string]: any } => {
            const f = group.controls[from];
            const t = group.controls[to];
            if (t.value && (f.value > t.value)) {
                t.setErrors({ fromLess: true });
            }
            return {};
        };
    }
}
