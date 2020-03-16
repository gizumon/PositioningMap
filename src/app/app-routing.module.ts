import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ProjectListComponent } from './components/project-list/project-list.component';
import { MapComponent } from './components/map/map.component';
import { AuthGuard } from './guarders/auth.guard';

const routes: Routes = [
  {path: 'login', component: LoginComponent },
  {path: 'projects', component: ProjectListComponent, canActivate: [AuthGuard] },
  {path: 'map/:id', data: { data: {} },component: MapComponent, canActivate: [AuthGuard] },
  {path: '', redirectTo: '/projects', pathMatch: 'full', canActivate: [AuthGuard]},
  {path: '**', redirectTo: '/projects', canActivate: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{ enableTracing: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
