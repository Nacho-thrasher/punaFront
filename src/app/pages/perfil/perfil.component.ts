import { Component, OnInit } from '@angular/core';
import { UsuarioService } from './../../services/usuario.service';
import { Usuario } from 'src/models/usuarios/usuario.model';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  public Usuario!: Usuario[];

  constructor(
    private usuarioService: UsuarioService
  ) { }

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(){
    this.usuarioService.cargarAllUsuarios()
      .subscribe((data: Usuario[]) => {
        console.log('entro',data);
        this.Usuario = data;
      }
    );
  }

}
