import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { FilterComponent } from './components/filter/filter.component';
import { SkillListComponent } from './components/skill-list/skill-list.component';
import { SkillFormComponent } from './components/skill-form/skill-form.component';


const routes: Routes = [
    {path: '', component: FilterComponent},
    { path: 'getskills', component: SkillListComponent },
  { path: 'addskill', component: SkillFormComponent },
  { path: 'deleteskill', component: SkillListComponent}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
