import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Empresa } from './../../models/empresas/empresa.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class ExtrasService {

  constructor(
    private http: HttpClient,
  ) { }

    getExtras(){
      const url = `${base_url}/extras`;
      return this.http.get<{ ok: boolean, data: any }>(url)
      .pipe(
        map((resp: { ok: boolean, data: any }) => {
          console.log(`extras service: `,resp);
          return resp.data
        })
      )
    }

    createExtra(data: any){
      const url = `${base_url}/extras`;
      return this.http.post<{ ok: boolean, data: any }>(url, data)
      .pipe(
        map((resp: { ok: boolean, data: any }) => {
          console.log(`extras service: `,resp);
          return resp.data
      })
    )
    }

    putExtra(id: string | null, data: any){
      const url = `${base_url}/extras/${id}`;
      return this.http.put<{ ok: boolean, data: any }>(url, data)
      .pipe(
        map((resp: { ok: boolean, data: any }) => {
          console.log(`extras service: `,resp);
          return resp.data
      }
    )
      )
    }

    deleteExtra(id: string){
      const url = `${base_url}/extras/${id}`;
      return this.http.delete<{ ok: boolean, data: any }>(url)
      .pipe(
        map((resp: { ok: boolean, data: any }) => {
          console.log(`extras service: `,resp);
          return resp.data
      })
    )
    }

}
