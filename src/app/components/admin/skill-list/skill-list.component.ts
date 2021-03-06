/*
    Contains the logic to expose the functionality to maintain the skill table
    CRD functionality

    To update a skill name, delete the skill and then update the skill
    Separate form skill-form is available to add a skill

    Skill names are matched with vacancies by the backend ignoring the case
    (i.e. converted to uppercase and matched with the uppercase of the vacancy text)
    It is therefore not necessary to worry about the case (uppercase or lowercase)

*/

import { Component, OnInit } from '@angular/core';
import { Skill } from 'src/app/models/skill';
import { Router } from '@angular/router';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-skill-list',
  templateUrl: './skill-list.component.html',
  styleUrls: ['./skill-list.component.scss']
})
export class SkillListComponent implements OnInit {

  skills: Skill[];
  backEndProcessed = true;
  errorMessage: string;


  constructor(private router: Router,
              private httpService: HttpService) {}

  ngOnInit() {
      this.getSkills();
  }

  public getSkills(): void {
    this.httpService.findAllSkills().subscribe((data: any) => {
      const skillData: Skill[] = [];
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
    this.httpService.deleteSkill(skill.href).subscribe(() => {
        this.backEndProcessed = true;
        const index: number = this.skills.indexOf(skill);
        this.skills.splice(index, 1);
    },
    err => {
        this.errorMessage =  err.message;
        this.backEndProcessed = false;
    });
  }

  // navigate to vacancy list
  public navigateVacancies(): void {
    this.router.navigate(['']);
  }

  // navigate to the form to add a skill
  public addSkill(): void {
    this.router.navigate(['admin/addskill']);
  }

}
