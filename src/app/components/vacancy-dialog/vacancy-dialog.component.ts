import { Component, Inject, AfterContentInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpService } from 'src/app/services/http.service';
import { Vacancy } from 'src/app/models/vacancy';

@Component({
  selector: 'app-vacancy-dialog',
  templateUrl: './vacancy-dialog.component.html',
  styleUrls: ['./vacancy-dialog.component.css'],
  providers: [HttpService]
})
export class VacancyDialogComponent implements AfterContentInit {

  errorMSG: string;
  vacancy: Vacancy;


  /**
   * Creates an instance of vacancy dialog component.
   * @param vacancyID Injected ID via vacancy-table.component.ts
   * @param filterService Service used for http request
   */
  constructor(@Inject(MAT_DIALOG_DATA) public vacancyID: string,
              private httpService: HttpService) { }



  /**
   * after content init
   * setTimeout needed to prevent angular error: 'ExpressionChangedAfterItHasBeenCheckedError'
   */
  ngAfterContentInit(): void {
    setTimeout(() => this.getVacancyDetails(this.vacancyID), 0);
  }


  /**
   * Gets vacancy details
   * @param vacancyID id from which details are requested
   */
  getVacancyDetails(vacancyID: string): void {
    this.httpService.getByID(vacancyID).subscribe((vacancy: any) => {
      vacancy.id = this.vacancyID;
      this.httpService.getSkillsForVacancy(vacancy._links.skills.href).subscribe((data: any) => {
        vacancy.skills = [];
        data._embedded.skills.forEach(el => {
          vacancy.skills.push(el.name);
        });
        this.vacancy = vacancy;
      });
  }, err => {
      this.errorMSG = err.error.message;
  });
  }

}
