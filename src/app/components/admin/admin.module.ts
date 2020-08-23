import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { SkillListComponent } from './skill-list/skill-list.component';
import { MaterialModule } from 'src/app/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SkillFormComponent } from './skill-form/skill-form.component';
import { UsersComponent } from './users/users.component';


@NgModule({
  declarations: [
    AdminComponent,
    SkillListComponent,
    SkillFormComponent,
    UsersComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    AdminRoutingModule,
    MaterialModule
  ],
  bootstrap: [AdminComponent]
})
export class AdminModule { }
