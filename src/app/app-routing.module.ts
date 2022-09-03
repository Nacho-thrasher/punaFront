import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// modulos
import { PagesRoutingModule } from './pages/pages.routing';
import { AuthRoutingModule } from './auth/auth.routing';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: '/dashboard' } // not fount 404 despues
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    PagesRoutingModule, //? rutasd de pages
    AuthRoutingModule //? rutasd de auth
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
