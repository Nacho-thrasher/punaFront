import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { RegistroService } from 'src/models/registros/registroServicio.model';
import { UsuarioService } from './usuario.service';


const base_url = environment.base_url;


@Injectable({
  providedIn: 'root'
})
export class RegistroDiarioService {

  constructor(
    private http: HttpClient,
    private usuarioService: UsuarioService
  ) { }

  crearRegistroDiario(arg: any){
    const url = `${base_url}/registro-diario`;
    return this.http.post<{ ok: boolean, registro: RegistroService }>(url,arg)
    .pipe(
      map((resp: { ok: boolean, registro: RegistroService } ) => {
        console.log(`registro diario service: `,resp);
        return resp.registro
      })
    )
  }

  cargarAllRegistrosDiarios(all?: boolean){
    if(all){
      const url = `${base_url}/registro-diario?all=true`;
      return this.http.get<{ ok: boolean, registros: RegistroService[] }>(url)
      .pipe(
        map((resp: { ok: boolean, registros: RegistroService[] } ) => {
          console.log(`registro diario service get all: `,resp);
          return resp.registros
        })
      )
    }
    else{
      const url = `${base_url}/registro-diario`;
      return this.http.get<{ ok: boolean, registros: RegistroService[] }>(url)
      .pipe(
        map((resp: { ok: boolean, registros: RegistroService[] } ) => {
          console.log(`registro diario service get: `,resp);
          return resp.registros
        })
      )
    }
  }

  cargarRegistrosDiariosByCompany(id: string){
    const url = `${base_url}/registro-diario/company/${id}`;
    return this.http.get<{ ok: boolean, registros: RegistroService[] }>(url)
    .pipe(
      map((resp: { ok: boolean, registros: RegistroService[] } ) => {
        console.log(`registro diario service get: `,resp);
        return resp.registros
      })
    )
  }

  cargarTotalesPorMeses(){
    const token = this.usuarioService.token;
    const headers = { 'authorization': token };
    const url = `${base_url}/totales`;
    return this.http.get<{ ok: boolean, data: any[], prueba: any[] }>(url, { headers })
    .pipe(
      map((resp: { ok: boolean, data: any[], prueba: any[] } ) => {
        console.log(`registro diario service get: `,resp);
        return resp.data
      }
    ))

  }

  cargarTotalesPorMes(mes: string | null){
    const token = this.usuarioService.token;
    const headers = { 'authorization': token };
    const url = `${base_url}/totales/${mes}`;
    return this.http.get<{ ok: boolean, data: any[] }>(url, { headers })
    .pipe(
      map((resp: { ok: boolean, data: any[] } ) => {
        console.log(`registro diario service get: `,resp);
        return resp.data
      }
    ))
  }

  cargarRegistrosDiariosEmpresaPorFecha(mes: string | null, dia: string | null, emrpesa: string | null){
    const token = this.usuarioService.token;
    const headers = { 'authorization': token };
    const url = `${base_url}/totales/${mes}/${dia}/${emrpesa}`;
    return this.http.get<{ ok: boolean, data: any[] }>(url, { headers })
    .pipe(
      map((resp: { ok: boolean, data: any[] } ) => {
        console.log(`registro diario service get: `,resp);
        return resp.data
      }
    ))
  }

  cargarRegistrosPorFechaCompleta(mes: string | null, dia: string | null){
    const token = this.usuarioService.token;
    const headers = { 'authorization': token };
    const url = `${base_url}/totales/${mes}/${dia}`;
    return this.http.get<{ ok: boolean, data: any[]}>(url, { headers })
    .pipe(
      map((resp: { ok: boolean, data: any[] } ) => {
        console.log(`registro diario service get visado: `,resp);
        return resp.data
      }
    ))
  }

  crearVisado(arg: any){
    const url = `${base_url}/visado`;
    return this.http.post<{ ok: boolean, visado: any }>(url,arg)
    .pipe(
      map((resp: { ok: boolean, visado: any } ) => {
        console.log(`registro diario service: `,resp);
        return resp.visado
      })
    )
  }

  crearRegistroManual(arg: any){
    const url = `${base_url}/registro-diario/manual`;
    return this.http.post<{ ok: boolean, registro: any }>(url,arg)
    .pipe(
      map((resp: { ok: boolean, registro: any } ) => {
        console.log(`registro diario service: `,resp);
        return resp.registro
      })
    )
  }

}
