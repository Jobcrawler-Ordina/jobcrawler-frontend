import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { SkillFormComponent } from './skill-form.component';
import { HttpService } from 'src/app/services/http.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { addSkillMock } from 'src/app/tests/adminServiceMockResponses';
import { of, throwError } from 'rxjs';
import { Skill } from 'src/app/models/skill';
import { Router } from '@angular/router';

describe('SkillFormComponent', () => {
  let component: SkillFormComponent;
  let fixture: ComponentFixture<SkillFormComponent>;
  let nativeComponent: HTMLElement;
  let httpSpy;
  let routerSpy;

  beforeEach(async(() => {
    httpSpy = jasmine.createSpyObj('HttpService', ['saveSkill']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        FormsModule,
        MatCardModule,
        MatDividerModule,
        MatFormFieldModule,
        MatInputModule
      ],
      declarations: [ SkillFormComponent ],
      providers: [
        FormBuilder,
        { provide: HttpService, useValue: httpSpy },
        { provide: Router, useValue: routerSpy }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SkillFormComponent);
    component = fixture.componentInstance;
    nativeComponent = fixture.debugElement.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should succesfully submit a skill', () => {
    httpSpy.saveSkill.and.returnValue(of(addSkillMock));
    const skill = new Skill();
    skill.name = 'test';

    component.skillForm.controls.skill.setValue(skill.name);
    component.onSubmit();

    expect(httpSpy.saveSkill).toHaveBeenCalledWith(skill);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['admin/getskills']);
  });

  it('should give an error when adding a new skill', () => {
    httpSpy.saveSkill.and.returnValue(throwError({ message: 'errorMessage' }));
    const skill = new Skill();
    skill.name = 'test';

    component.skillForm.controls.skill.setValue(skill.name);
    component.onSubmit();

    expect(httpSpy.saveSkill).toHaveBeenCalledWith(skill);
    expect(routerSpy.navigate).toHaveBeenCalledTimes(0);
    expect(component.errorMessage).toBe('Error adding skill in backend: errorMessage');
  });
});
