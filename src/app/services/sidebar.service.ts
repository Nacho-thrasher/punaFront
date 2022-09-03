import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  constructor() { }

  //@todo -> enviaar menu desde el back al servicio por tipo de usuario
  public menu: any[] = [];

  cargarMenu(){
    this.menu = localStorage.getItem('menu')
      ? JSON.parse(localStorage.getItem('menu')!)
      : [];
  }

}
