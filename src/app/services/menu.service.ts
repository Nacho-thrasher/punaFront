import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Menu } from 'src/models/menus/menu.model';
import { AfternoonSnack } from './../../models/menus/afternoonSnack.model';
import { Breakfast } from './../../models/menus/breakfast.model';
import { Dinner } from './../../models/menus/dinner.model';
import { Lunch } from './../../models/menus/lunch.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  constructor(
    private http: HttpClient,
  ) { }

  cargarMenus(){
    const url = `${base_url}/menu`;
    return this.http.get<{ ok: boolean, menus: Menu[] }>(url)
    .pipe(
      map((resp: { ok: boolean, menus: Menu[] } ) => {
        console.log(`menu service: `,resp);
        return resp.menus
      })
    )
  }

  listarBreakfast(){
    const url = `${base_url}/menu/type/breakfast`;
    return this.http.get<{ ok: boolean, breakfast: Breakfast[] }>(url)
    .pipe(
      map((resp: { ok: boolean, breakfast: Breakfast[] } ) => {
        console.log(`menu breakfast: `,resp);
        return resp.breakfast
      })
    )
  }

  listarLunch(){
    const url = `${base_url}/menu/type/lunch`;
    return this.http.get<{ ok: boolean, lunch: Lunch[] }>(url)
    .pipe(
      map((resp: { ok: boolean, lunch: Lunch[] } ) => {
        console.log(`menu lunch: `,resp);
        return resp.lunch
      })
    )
  }

  listarDinner(){
    const url = `${base_url}/menu/type/dinner`;
    return this.http.get<{ ok: boolean, dinner: Dinner[] }>(url)
    .pipe(
      map((resp: { ok: boolean, dinner: Dinner[] } ) => {
        console.log(`menu dinner: `,resp);
        return resp.dinner
      })
    )
  }

  listarAfternoonSnack(){
    const url = `${base_url}/menu/type/afternoonSnack`;
    return this.http.get<{ ok: boolean, afternoonSnack: AfternoonSnack[] }>(url)
    .pipe(
      map((resp: { ok: boolean, afternoonSnack: AfternoonSnack[] } ) => {
        console.log(`menu afternoonSnack: `,resp);
        return resp.afternoonSnack
      })
    )
  }

  actualizarMenu(menu: Menu, id: string | null){
    console.log(`actualizado service: `,menu);
    const url = `${base_url}/menu/${id}`;
    return this.http.put(url, menu)
    .pipe(
      map((resp: any) => {
        console.log(`menu actualizado: `,resp);
        return resp.updateMenu
      }
    ))
  }

  crearPlato(data: any){
    const url = `${base_url}/menu/plato`;
    return this.http.post(url, {...data})
    .pipe(
      map((resp: any) => {
        console.log(`plato creado: `,resp);
        return resp.data
      }
    ))
  }

}
