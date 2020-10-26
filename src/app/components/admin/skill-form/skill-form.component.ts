import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Skill} from 'src/app/models/skill';
import {HttpErrorResponse} from '@angular/common/http';
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
    styleUrls: ['./skill-form.component.scss']
})
export class SkillFormComponent implements OnInit {

    skill: Skill;
    errorMessage: string;
    skillForm: FormGroup;

    errorMessages = {
        skill : [
            { type: 'required', message: 'Skill is required' },
            { type: 'minlength', message: 'Minimum length is 3 chars' }
        ]
    };

    constructor(private router: Router,
                private httpService: HttpService,
                private fb: FormBuilder) {}

    ngOnInit(): void {
        this.skill = new Skill();
        this.skillForm = this.fb.group({
            skill: ['', [Validators.required, Validators.minLength(3)]]
        });
    }

    public onSubmit(): void {
        this.skill.name = this.skillForm.value.skill;
        this.httpService.saveSkill(this.skill).subscribe(() => {
                this.gotoSkillListAfterAddition();
            },
            err => {
                this.errorMessage = 'Error adding skill in backend: ' + err.message;
            }
        );
    }


    private gotoSkillListAfterAddition(): void {
        this.router.navigate(['admin/getskills']);
    }
}
