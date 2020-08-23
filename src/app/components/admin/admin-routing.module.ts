import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { SkillListComponent } from './skill-list/skill-list.component';
import { SkillFormComponent } from './skill-form/skill-form.component';


const routes: Routes = [
  { path: '', component: AdminPanelComponent,
    children: [
      { path: 'getskill', component: SkillListComponent },
      { path: 'addskill', component: SkillFormComponent }
    ] 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
