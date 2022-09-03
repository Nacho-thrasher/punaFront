import { Usuario } from "../../models/usuarios/usuario.model";

export interface CargarUsuario {
  total: number;
  usuarios: Usuario[];
}
