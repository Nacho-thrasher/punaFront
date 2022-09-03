import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Empresa } from './../../models/empresas/empresa.model';

const base_url = environment.base_url;


@Injectable({
  providedIn: 'root'
})
export class EmpresaService {

  constructor(
    private http: HttpClient,

  ) { }

  get token():string {
    return localStorage.getItem('token') || '';
  }

  get headers(){
    return {
      headers: {
        'authorization': this.token
      }
    }
  }

  cargarEmpresas(){
    const url = `${base_url}/company`;
    return this.http.get<{ ok: boolean, empresas: Empresa[] }>(url, this.headers)
    .pipe(
      map((resp: { ok: boolean, empresas: Empresa[] } ) => {
        console.log(`empresa service: `,resp);
        return resp.empresas
      })
    )
    //delay() , va con pipe antes de map para demorar la carga
  }
  empresaById(id: string){
    const url = `${base_url}/company/${id}`;
    return this.http.get<{ ok: boolean, empresa: Empresa }>(url, this.headers)
    .pipe(
      map((resp: { ok: boolean, empresa: Empresa } ) => {
        console.log(`empresa service: `,resp);
        return resp.empresa
      })
    )
  }

  crearEmpresa(empresa: Empresa){
    const url = `${base_url}/company`;
    return this.http.post<{ ok: boolean, data: Empresa }>(url, empresa, this.headers)
    .pipe(
      map((resp: { ok: boolean, data: Empresa } ) => {
        console.log(`empresa service: `,resp);
        return resp.data
      })
    )
  }

  editarEmpresa(empresa: Empresa, id: string | null){
    const url = `${base_url}/company/${id}`;
    return this.http.put<{ ok: boolean, data: Empresa }>(url, empresa, this.headers)
    .pipe(
      map((resp: { ok: boolean, data: Empresa } ) => {
        console.log(`empresa service: `,resp);
        return resp.data
      })
    )
  }

}
