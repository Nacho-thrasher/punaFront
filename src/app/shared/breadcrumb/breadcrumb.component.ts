import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ActivationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.css']
})
export class BreadcrumbComponent implements OnInit, OnDestroy {

  public titulo: string | undefined;
  public content: string | undefined;
  public tituloSub$: Subscription;
  public pathSub$: Subscription;
  public numS!: string | undefined
  public UsuarioRole = this.usuarioService.role;
  public isComensal: boolean = false;

  constructor(
    private router:Router,
    private activatedRouter: ActivatedRoute,
    private usuarioService: UsuarioService
  ) {

    this.tituloSub$ = this.getDataRuta().subscribe(
      ({titulo, content}) =>{
        this.titulo = titulo;
        document.title = `Puna - ${titulo}`;
        // instance
        this.content = content;
        //console.log(this.content);

      }
    )
    this.pathSub$ = this.getPathRuta().subscribe(
      ({ id_ext, id }) =>{


      }
    )

  }
  ngOnDestroy(): void {
    this.tituloSub$.unsubscribe();
    this.pathSub$.unsubscribe();
  }

  ngOnInit(): void {
    if (this.UsuarioRole == 'comensal') {
      this.isComensal = true;
    }
  }

  getDataRuta(){
    return this.router.events
      .pipe(
        // instance of ??, snapshot??
        filter((event): event is ActivationEnd => event instanceof ActivationEnd),
        filter((event: ActivationEnd) => event.snapshot.firstChild === null),
        map((event: ActivationEnd) => event.snapshot.data)
      )
  }
  getPathRuta(){
    return this.router.events
      .pipe(
        // instance of ??, snapshot??
        filter((event): event is ActivationEnd => event instanceof ActivationEnd),
        filter((event: ActivationEnd) => event.snapshot.firstChild === null),
        map((event: ActivationEnd) => event.snapshot.params)
      )
  }


}
