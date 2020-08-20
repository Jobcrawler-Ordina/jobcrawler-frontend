import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { FilterComponent } from './components/filter/filter.component';
import { SkillListComponent } from './components/skill-list/skill-list.component';
import { SkillFormComponent } from './components/skill-form/skill-form.component';
import { AuthGuard } from './guard/auth.guard';


const routes: Routes = [
  {path: '', component: FilterComponent},
  { path: 'getskills', component: SkillListComponent, canActivate: [AuthGuard], data: { role: 'ROLE_ADMIN' } },
  { path: 'addskill', component: SkillFormComponent, canActivate: [AuthGuard], data: { role: 'ROLE_ADMIN' } },
  { path: 'deleteskill', component: SkillListComponent, canActivate: [AuthGuard], data: { role: 'ROLE_ADMIN' } }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { useHash: true })],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
