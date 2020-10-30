import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillListComponent } from './skill-list.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpService } from 'src/app/services/http.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { mockSkills } from 'src/app/tests/httpMockResponses';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { Router } from '@angular/router';

describe('SkillListComponentTest', () => {
  let component: SkillListComponent;
  let fixture: ComponentFixture<SkillListComponent>;
  let httpService: HttpService;
  let nativeComponent: HTMLElement;
  let httpSpy;
  let routerSpy;

  beforeEach(async(() => {
    httpSpy = jasmine.createSpyObj('HttpService', ['findAllSkills', 'deleteSkill']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    httpSpy.findAllSkills.and.returnValue(of(mockSkills));

    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        MatCardModule,
        MatDividerModule
      ],
      declarations: [ SkillListComponent ],
      providers: [
        { provide: HttpService, useValue: httpSpy },
        { provide: Router, useValue: routerSpy }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SkillListComponent);
    component = fixture.componentInstance;
    httpService = TestBed.inject(HttpService);
    nativeComponent = fixture.debugElement.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show skills in the skill-list', () => {
    // Arrange
    component.skills = [];
    mockSkills._embedded.skills.forEach(d => {
      component.skills.push({
        href: d._links.self.href,
        name: d.name
      });
    });

    // Act
    fixture.detectChanges();
    const skillTable = nativeComponent.querySelector('#skillTable');
    const skillRows = skillTable.children[1].children;

    // Assert
    expect(skillRows[0].textContent.trim()).toBe('');
    expect(skillRows[1].children[0].textContent.trim()).toBe(mockSkills._embedded.skills[0].name);
    expect(skillRows[2].children[0].textContent.trim()).toBe(mockSkills._embedded.skills[1].name);
  });

  describe('HTTP Request', () => {

    it('should get all skills when the getSkills() method is called', () => {
      // component.getSkills() is automatically called when page is loaded due to ngOnInit

      expect(component.skills.length).toBe(2);
      expect(httpSpy.findAllSkills).toHaveBeenCalledTimes(1);
    });

    it('should delete a skill and remove it from the array', () => {
      httpSpy.deleteSkill.and.returnValue(of({}));
      const skillHref = component.skills[1].href;
      component.deleteRow(component.skills[1]);

      expect(httpSpy.deleteSkill).toHaveBeenCalledWith(skillHref);
      expect(component.skills.length).toBe(1);
    });

    it('should give an error when trying to remove a skill', () => {
      httpSpy.deleteSkill.and.returnValue(throwError({ message: 'error' }));
      const skillHref = component.skills[1].href;
      component.deleteRow(component.skills[1]);

      expect(httpSpy.deleteSkill).toHaveBeenCalledWith(skillHref);
      expect(component.skills.length).toBe(2);
      expect(component.errorMessage).toEqual('error');
    });

    it('should redirect you back to vacancies when navigateVacancies() is called', () => {
      component.navigateVacancies();

      expect(routerSpy.navigate).toHaveBeenCalledWith(['']);
    });

    it('should redirect you to the add skill page when addSkill() is called', () => {
      component.addSkill();

      expect(routerSpy.navigate).toHaveBeenCalledWith(['admin/addskill']);
    });

    afterEach(() => {
      fixture.destroy();
    });
  });
});
