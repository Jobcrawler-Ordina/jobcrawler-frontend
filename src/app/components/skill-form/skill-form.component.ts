import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Skill} from 'src/app/models/skill';
import {HttpErrorResponse} from '@angular/common/http';
import {ErrorCode} from '../../services/errorCode';
import { HttpService } from 'src/app/services/http.service';

/*
*   Adding a skill by name
*
*   Name should be unique, error message is displayed otherwise
*   Name uniqueness check takes place in the back end
*   Front end checks whether the name is actually there and minimum length of 3 characters
* */

@Component({
    selector: 'app-skill-form',
    templateUrl: './skill-form.component.html',
    styleUrls: ['./skill-form.component.css'],
    providers: [HttpService]
})
export class SkillFormComponent {

    constructor(
        private router: Router,
        private httpService: HttpService) {
        this.skill = new Skill();
    }

    skill: Skill;
    skillAcceptedBackend = true;

    errorMessage: string;

    public navigateSkillList(): void {
        this.router.navigate(['getskills']);
    }

    public onSubmit(): void {
        this.skillAcceptedBackend = true;
        this.httpService.saveSkill(this.skill).subscribe(() => {
                    console.log('successfully saved new skill:' + this.skill.name);
                    this.gotoSkillListAfterAddition();
            },
            err => {
                console.log("Some error occured");
                console.log(err);
                    if (err instanceof HttpErrorResponse) {
                        console.log('Error adding skill in backend:' + this.skill.name );
                        this.errorMessage = 'Error adding skill in backend:' + err.message;
                        this.skillAcceptedBackend = false;
                    }
            }
        );
    }


    private gotoSkillListAfterAddition(): void {
        this.router.navigate(['getskills']);
    }
}
