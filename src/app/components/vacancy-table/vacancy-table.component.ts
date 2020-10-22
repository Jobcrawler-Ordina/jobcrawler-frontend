import { Component, Output, Input, OnChanges } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { IVacancies } from 'src/app/models/ivacancies';
import { MatDialog } from '@angular/material/dialog';
import { VacancyDialogComponent } from '../vacancy-dialog/vacancy-dialog.component';
import { CommonModule} from '@angular/common';
import { Sort } from '@angular/material/sort';
import { Location } from '../../models/location';

@Component({
  selector: 'app-vacancy-table',
  templateUrl: './vacancy-table.component.html',
  styleUrls: ['./vacancy-table.component.scss']
})
export class VacancyTableComponent implements OnChanges {

  @Input() isShow: boolean;
  @Input() vacancies: IVacancies[];
  @Input() sortBy: string;
  @Input() sortOrder: string;
  @Input() homeLocation?: Location;
  @Output() filterButtonClicked = new EventEmitter();
  @Output() changeSorting: EventEmitter<Sort> = new EventEmitter<Sort>();

  displayedColumns: string[];
  displayedColumnsWithoutDistance: string[] = ['title', 'broker', 'location', 'postingDate', 'openVacancyURL'];
  displayedColumnsWithDistance: string[] = ['title', 'broker', 'location', 'distance', 'postingDate', 'openVacancyURL'];
    showClass: string;


  /**
   * Creates an instance of vacancy table component.
   * @param dialog matdialog
   */
  constructor(private dialog: MatDialog) {
  }

  /**
   * on changes
   */
  ngOnChanges(): void {
    this.showClass = this.isShow ? 'table-container' : 'table-container-no-filter';

    if (this.homeLocation) {
        if ((this.homeLocation.name !== '') && this.homeLocation.name !== undefined) {
            this.displayedColumns = this.displayedColumnsWithDistance;
        } else {
            this.displayedColumns = this.displayedColumnsWithoutDistance;
        }
    } else {
        this.displayedColumns = this.displayedColumnsWithoutDistance;
    }
  }

  /**
   * Function for resizing filter/table.
   */
  public resizeFilterClick(): void {
    this.filterButtonClicked.emit();
  }


  /**
   * Opens dialog / modal
   * @param vacancyID id that is passed to vacancy-dialog.component
   */
  public openDialog(vacancyID: string): void {
    this.dialog.open(VacancyDialogComponent, {
      data: vacancyID,
      autoFocus: false
   });
  }


  /**
   * Sorts data
   * @param sort Column / direction
   */
  public sortData(sort: Sort) {
    this.changeSorting.emit(sort);
  }

}
