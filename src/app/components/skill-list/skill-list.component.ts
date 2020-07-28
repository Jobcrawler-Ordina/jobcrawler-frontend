/*
    Contains the logic to expose the functionality to maintain the skill table
    CRD functionality

    To update a skill name, delete the skill and then update the skill
    Separate form skill-form is available to add a skill

    Skill names are matched with vacancies by the backend ignoring the case
    (i.e. converted to uppercase and matched with the uppercase of the vacancy text)
    It is therefore not necessary to worry about the case (uppercase or lowercase)

    After addition of skills, it is necessary to relink the skills by pressing the
    relink buttons. The back-end will then create new matching links between the
    skills table and the vacancies table.
*/


import { Component, OnInit } from '@angular/core';
import { Skill } from 'src/app/models/skill';
import { Router } from '@angular/router';
import {HttpErrorResponse} from '@angular/common/http';
import {ErrorCode} from '../../services/errorCode';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-skill-list',
  templateUrl: './skill-list.component.html',
  styleUrls: ['./skill-list.component.css'],
  providers: [HttpService]
})
export class SkillListComponent implements OnInit {

  skills: Skill[];
  backEndProcessed = true;
  errorMessage: string;


  constructor(
    private router: Router,
    private httpService: HttpService) {
  }

  ngOnInit() {
      this.getSkills();
  }

  public getSkills(): void {
    this.httpService.findAllSkills().subscribe((data: any) => {
      let skillData: Skill[] = [];
      data._embedded.skills.forEach((skill: any) => {
        skillData.push({
          href: skill._links.self.href,
          name: skill.name
        });
      });
      this.skills = skillData;
    });
  }

    // delete the row from the skill table
  public deleteRow(skill: Skill): void {
    console.log('delete this row:' + skill.name);
    this.httpService.deleteSkill(skill.href).subscribe(() => {
        this.backEndProcessed = true;
        const index: number = this.skills.indexOf(skill);
        this.skills.splice(index, 1);
    },
    err => {
      console.log("An error occured");
      console.log(err);
      if (err instanceof HttpErrorResponse) {
        console.log( 'Failed to delete skill:' +  err.message );
        this.errorMessage =  err.message;
        this.backEndProcessed = false;
      }
    });
  }

  // rematch the links after table skills has been edited (creates new links records)
  public relinkSkills(): void {
    console.log('relink skills');
    this.httpService.relinkSkills().subscribe((data: ErrorCode) => {
            if (data.errorCode !== 'OK') {
                console.log('Failed to relink skills:' + data.errorCode);
                this.errorMessage =  data.errorCode;
                this.backEndProcessed = false;
            } else {
                this.errorMessage = '';
                this.backEndProcessed = true;
                console.log('successfully relinked skills');
            }
        },
        err => {
            if (err instanceof HttpErrorResponse) {
                console.log( 'Failed to relink skills:' +  err.message );
                this.errorMessage =  err.message;
                this.backEndProcessed = false;
            }
        });
  }

  // navigate to vacancy list
  public navigateVacancies(): void {
    this.router.navigate(['']);
  }

  // navigate to the form to add a skill
  public addSkill(): void {
    this.router.navigate(['addskill']);
  }

}
