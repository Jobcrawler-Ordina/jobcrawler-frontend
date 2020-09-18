import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { FilterComponent } from './components/filter/filter.component';
import { AuthGuard } from './guard/auth.guard';

const routes: Routes = [
  { path: '', component: FilterComponent },
  { path: 'admin', canActivate: [AuthGuard], data: { role: 'ROLE_ADMIN' },
    loadChildren: () => import('./components/admin/admin.module').then(m => m.AdminModule) },
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { useHash: true })],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
