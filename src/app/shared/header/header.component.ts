import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuario } from 'src/models/usuarios/usuario.model';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  public usuario?: Usuario;
  public isActive: boolean = false;
  public roleUser: string = this.usuarioService.role;
  constructor(
    private usuarioService: UsuarioService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.usuario = this.usuarioService.usuario;
    console.log('header: ',this.usuario);
  }

  logout(){
    this.usuarioService.logout();
  }

}
