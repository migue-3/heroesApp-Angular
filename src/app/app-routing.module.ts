import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Error404PageComponent } from './shared/pages/error404-page/error404-page.component';

//Importamos las dos funciones que creamos anteriormente.
import { canActivateGuard, canMatchGuard } from './auth/guards/auth.guard';
import { canActivateGuardPublic, canMatchGuardPublic } from './auth/guards/public.guard';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then( m => m.AuthModule),
    canActivate: [canActivateGuardPublic],
    canMatch: [canMatchGuardPublic]  
  },
  {
    path: 'heroes',
    loadChildren: () => import('./heroes/heroes.module').then( m => m.HeroesModule),
    canActivate: [canActivateGuard], //Anclamos la función del canActive
    canMatch: [canMatchGuard]       //Anclamos la función del canMatch
  },
  {
    path: '404',
    component: Error404PageComponent
  },
  {
    path: '',
    redirectTo: 'heroes',
    pathMatch: 'full'  //sirve para indicar que tiene que ser exactamente igual el path
  },
  {
    path: '**',
    redirectTo: '404'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
