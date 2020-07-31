import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillListComponent } from './skill-list.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpService } from 'src/app/services/http.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { mockSkills } from 'src/app/tests/constants';
import { environment } from 'src/environments/environment';

describe('SkillListComponentTest', () => {
  let component: SkillListComponent;
  let fixture: ComponentFixture<SkillListComponent>;
  let httpService: HttpService;
  let httpMock: HttpTestingController;
  let nativeComponent: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ 
        RouterTestingModule,
        HttpClientTestingModule 
      ],
      declarations: [ SkillListComponent ],
      providers: [ HttpService ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SkillListComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.get(HttpTestingController);
    httpService = TestBed.get(HttpService);
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

    it('should remove skill from skills array when calling the deleteSkill function', () => {
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
  
      httpService.deleteSkill(component.skills[0].href).subscribe(() => {
        const index: number = component.skills.indexOf(component.skills[0]);
        component.skills.splice(index, 1);
        expect(component.skills.length).toBe(1);
      });
  
      // Expect
      const request = httpMock.expectOne(component.skills[0].href);
      expect(request.request.method).toBe("DELETE");
      request.flush(of({}));
      httpMock.expectOne(environment.api + "/skills");
    });
  
    afterEach(() => {
      fixture.destroy();
      httpMock.verify();
    });
  });
});