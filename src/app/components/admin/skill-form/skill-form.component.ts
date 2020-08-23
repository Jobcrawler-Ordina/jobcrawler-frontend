import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Skill} from 'src/app/models/skill';
import {HttpErrorResponse} from '@angular/common/http';
import {ErrorCode} from '../../../services/errorCode';
import { HttpService } from 'src/app/services/http.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
    styleUrls: ['./skill-form.component.scss'],
    providers: [HttpService]
})
export class SkillFormComponent implements OnInit {

    skill: Skill;
    skillAcceptedBackend = true;

    errorMessage: string;
    skillForm: FormGroup;

    error_messages = {
        'skill' : [
            { type: 'required', message: 'Skill is required' },
            { type: 'minlength', message: 'Minimum length is 3 chars' }
        ]
    };

    constructor(
        private router: Router,
        private httpService: HttpService,
        private fb: FormBuilder) {
        this.skill = new Skill();
    }

    ngOnInit(): void {
        this.skillForm = this.fb.group({
            skill: ['', [Validators.required, Validators.minLength(3)]]
        });
    }

    public onSubmit(): void {
        console.log(this.skillForm.value.skill);
        this.skill.name = this.skillForm.value.skill;
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
        this.router.navigate(['admin/getskills']);
    }
}
