import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillListComponent } from './skill-list.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpService } from 'src/app/services/http.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('SkillListComponent', () => {
  let component: SkillListComponent;
  let fixture: ComponentFixture<SkillListComponent>;

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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
