import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UsuarioService } from './../services/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(
    private usuarioService: UsuarioService,
    private router: Router
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    console.log('admin guard', this.usuarioService.usuario);
    // usuario.user_type.name
    if (this.usuarioService.token === undefined || this.usuarioService.token === '') {
      this.router.navigateByUrl('/dashboard');
      return false;
    }
    else{
      if (this.usuarioService.usuario.user_type!.name === 'admin') {
        return true;
      }
      else{
        this.router.navigateByUrl('/dashboard');
        return false;
      }
    }

  }

}
