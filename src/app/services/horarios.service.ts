import { Injectable, NgZone } from '@angular/core';
import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Horarios } from './../../models/horarios/horarios.model';
import { Observable } from 'rxjs';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class HorariosService {

  constructor(
    private http: HttpClient,
  ) { }

  cargarHorarios(){
    const url = `${base_url}/horarios-comida`;
    return this.http.get<{ ok: boolean, data: Horarios[] }>(url)
    .pipe(
      map((resp: { ok: boolean, data: Horarios[] } ) => {
        console.log(`horarios service get: `,resp);
        return resp.data
      })
    )
  }

  actualizarHorario(horario: Horarios, id: string | null): Observable<Horarios> {
    const url = `${base_url}/horarios-comida/${id}`;
    return this.http.put<{ ok: boolean, data: Horarios }>(url, horario)
    .pipe(
      map((resp: { ok: boolean, data: Horarios } ) => {
        console.log(`horarios service put: `,resp);
        return resp.data
      })
    )
  }

  // observable para saber en que hora esta el usuario, e indicar que tipo de comida es
  getCurrentTime(): Observable<any> {
    const url = `${base_url}/horarios-comida/current-time`;
    return this.http.get<{ ok: boolean, data: any }>(url)
    .pipe(
      map((resp: { ok: boolean, data: any } ) => {
        console.log(`horarios service get: `,resp);
        return resp.data
      })
    )
  }


}
