import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { MenuComponent } from './pages/menu/menu.component';
import { UsuarioGuardService } from './guards/usuario-guard.service';

const routes: Routes = [
  {path: '', component:MenuComponent},
  {path: 'home/:id', component:HomeComponent},
  {path: 'menu', component:MenuComponent},
  {path: '**',pathMatch:'full',redirectTo:''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

