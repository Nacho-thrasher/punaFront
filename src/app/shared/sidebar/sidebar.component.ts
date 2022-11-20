import { Component, OnInit, OnDestroy } from '@angular/core';
import { SidebarService } from './../../services/sidebar.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuario } from 'src/models/usuarios/usuario.model';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
declare var $: any;
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit, OnDestroy {

  public usuario?: Usuario;
  public isActive: boolean = false;
  public imgSubscription?: Subscription;
  public imagen: string = '';
  public roleUser = this.usuarioService.role;
  public isComensal: boolean = false;

  constructor(
    public sidebarService: SidebarService,
    private usuarioService: UsuarioService,
    private router: Router,
    private activatedRoute: ActivatedRoute

  ) { }

  ngOnDestroy(): void {
    if (this.usuario === undefined || this.usuario === null) {
      //? si no hay usuario, no hay subscripcion
      return;
    }
    else{
      this.imgSubscription?.unsubscribe();
    }
  }

  ngOnInit(): void {

    this.isComensal = this.roleUser == 'autoservicio comensal';

    $('[data-widget="treeview"]').Treeview("init");
    console.log(`sidebar menu`, this.sidebarService.menu);
    //? traer usuario logueado
    console.log('sidebar, linea 30:',this.usuarioService.usuario);
    this.usuario = this.usuarioService.usuario;
    // this.imgSubscription = this.usuarioService.usuario.subscribe(
    //   (usuario: Usuario) => {
    //     this.usuario = usuario;
    //     this.imagen = usuario.image;
    //   }
    // );

  }



}
