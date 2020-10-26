import { Component, Output, Input, OnChanges, OnInit } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { IVacancies } from 'src/app/models/ivacancies';
import { MatDialog } from '@angular/material/dialog';
import { VacancyDialogComponent } from '../vacancy-dialog/vacancy-dialog.component';
import { Sort } from '@angular/material/sort';

@Component({
  selector: 'app-vacancy-table',
  templateUrl: './vacancy-table.component.html',
  styleUrls: ['./vacancy-table.component.scss']
})
export class VacancyTableComponent implements OnChanges, OnInit {

  @Input() isShow: boolean;
  @Input() vacancies: IVacancies[];
  @Input() sortBy: string;
  @Input() sortOrder: string;
  @Input() distance?: number;
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

  ngOnInit(): void {
    this.displayedColumns = this.displayedColumnsWithoutDistance;
  }

  /**
   * on changes
   */
  ngOnChanges(): void {
    this.showClass = this.isShow ? 'table-container' : 'table-container-no-filter';

    if (this.distance) {
        if (this.distance !== 0) {
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
