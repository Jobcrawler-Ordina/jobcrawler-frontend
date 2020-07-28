import { Component, Output, Input, OnChanges } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { IVacancies } from 'src/app/models/ivacancies';
import { MatDialog } from '@angular/material/dialog';
import { VacancyDialogComponent } from '../vacancy-dialog/vacancy-dialog.component';

@Component({
  selector: 'app-vacancy-table',
  templateUrl: './vacancy-table.component.html',
  styleUrls: ['./vacancy-table.component.scss']
})
export class VacancyTableComponent implements OnChanges {

  @Input() isShow: boolean;
  @Input() vacancies: IVacancies[];
  @Output() filterButtonClicked = new EventEmitter();

  displayedColumns: string[] = ['title', 'broker', 'location', 'postingDate', 'openVacancyURL'];
  showClass: string;


  /**
   * Creates an instance of vacancy table component.
   * @param dialog 
   */
  constructor(private dialog: MatDialog) {
  }
  
  /**
   * on changes
   */
  ngOnChanges(): void {
    this.showClass = this.isShow ? 'table-container' : 'table-container-no-filter';
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
    this.dialog.open(VacancyDialogComponent, { data: vacancyID });
  }

}