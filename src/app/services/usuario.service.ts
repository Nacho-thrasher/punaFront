import { Injectable, NgZone, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { tap, map, catchError, delay } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { CargarUsuario } from "../interfaces/cargar_usuarios.interface";
import { Usuario } from '../../models/usuarios/usuario.model';
import { UserType } from './../../models/usuarios/user_type.model';
//@ ->  sidebar service

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})

export class UsuarioService {

  public usuario!: Usuario;

  constructor(
    private http: HttpClient,
    private router: Router,
    private ngZone: NgZone
  ) {}

  //* get token
  get token(): string {
    return localStorage.getItem('token') || '';
  }
  //* get role type user
  get role(): any {
    if (this.usuario.user_type === undefined || this.usuario.user_type === null) {
      return 'USER_ROLE';
    }
    else{
      console.log('userservice, linea 39:',this.usuario.user_type);
      return this.usuario.user_type?.name;
    }
  }

  //* get notifications
  get notifications(): any {
    return
  }

  //* get user id
  get uid(): string {
    return this.usuario.uid || '';
  }

  //* get headers
  get headers() {
    return {
      headers: {
        'authorization': this.token,
      },
    };
  }

  //* logout
  logout(){
    localStorage.removeItem('token');
    localStorage.removeItem('menu');
    this.ngZone.run(()=>{
      this.router.navigateByUrl('/login')
    })
  }

  //* guardar en el localstorage
  guardarStorage(token: string, menu?: any) {
    localStorage.setItem('token', token);
    localStorage.setItem('menu', JSON.stringify(menu))
  }

  //* validar token
  validarToken(): Observable<boolean> {
    return this.http
      .get<Usuario>(`${base_url}/auth/renew`, {
        headers: { 'authorization': this.token, },
      })
      .pipe(
        map((resp: any) => {
          this.usuario = resp.user;
          this.guardarStorage(resp.token, resp.menu);
          //? guardar notificaciones en el localstorage
          // si resp.notifications viene null, se guarda un array vacio
          localStorage.setItem('notifications', JSON.stringify(resp.notificaciones || []));
          return true;
        }),
        //? catchError para manejar errores, of para retornar un observable vacio si hay error y no hay respuesta del servidor o si hay respuesta pero no hay token
        catchError((error) => of(false))
      );
  }

  //* crear usuario
  crearUsuario(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(`${base_url}/users`, usuario).pipe(
      map((resp: any) => {
        this.guardarStorage(resp.token, resp.menu);
        return resp;
      })
    );
  }

  //* login usuario
  looginUsuario(usuario: CargarUsuario): Observable<any> {
    console.log('usuario service linea 110:',usuario);
    return this.http.post(`${base_url}/auth`, usuario).pipe(
      map((resp: any) => {
        this.usuario = resp.user;
        this.guardarStorage(resp.token, resp.menu);
        return resp;
      })
    );
  }
  //? tap -> ejecuta una funcion antes de retornar el observable
  cargarAllUsuarios(): Observable<Usuario[]> {
    console.log('entro');
    return this.http.get<{ ok: boolean, users: Usuario[] }>(`${base_url}/users`, this.headers).pipe(
      map((resp: { ok: boolean, users: Usuario[] } ) => resp.users)
      // delay(1000)
    );
  }
  cargarUsuariosByType(type: string): Observable<Usuario[]> {
    return this.http.get<{ ok: boolean, users: Usuario[] }>(`${base_url}/users/${type}`, this.headers).pipe(
      map((resp: { ok: boolean, users: Usuario[] } ) => {
        return resp.users
      })
      // delay(1000)
    );
  }
  // recibe un objeto con datos de ussuario y id empresa
  createUserWithCompany(user: any, idCompany: string, userType: string | null): Observable<any> {
    return this.http.post(`${base_url}/users/${idCompany}/${userType}`, user).pipe(
      map((resp: any) => {
        // this.guardarStorage(resp.token, resp.menu);
        console.log('usuario service: ',resp);
        return resp;
      })
    );
  }

  cargarUsersTypes(): Observable<UserType[]> {
    return this.http.get<{ ok: boolean, usersTypes: UserType[] }>(`${base_url}/users/types`, this.headers).pipe(
      map((resp: { ok: boolean, usersTypes: UserType[] } ) => resp.usersTypes)
      // delay(1000)
    );
  }

  //* actualizar usuario
  actualizarUsuario(usuario: Usuario, id: string | null): Observable<Usuario> {
    return this.http.put<Usuario>(`${base_url}/users/${id}`, usuario, this.headers).pipe(
      // delay para simular un tiempo de respuesta
      map((resp: any) => {
        console.log('editar usuario service: ',resp);
        return resp;
      })
    );
  }

  crearComensalesExcel(comensales: any, idCompany: string): Observable<any> {
    const url = `${base_url}/comensales/excel/${idCompany}`;
    return this.http.post(url, comensales, this.headers)
  }

  cambiarPassword(password: any, id: string | null): Observable<any> {
    return this.http.put(`${base_url}/users/password/${id}`, { password }, this.headers).pipe(
      map((resp: any) => {
        console.log('editar usuario service: ',resp);
        return resp;
      })
    );
  }

}
