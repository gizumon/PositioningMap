import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ProjectListComponent } from './components/project-list/project-list.component';
import { MapComponent } from './components/map/map.component';

const routes: Routes = [
  {path: '', redirectTo: '/projects', pathMatch: 'full' },
  {path: 'login', component: LoginComponent },
  {path: 'projects', component: ProjectListComponent },
  {path: 'map/:id', component: MapComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{ enableTracing: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
