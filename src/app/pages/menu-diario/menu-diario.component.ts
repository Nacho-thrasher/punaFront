import { Component, OnInit } from '@angular/core';
import { Menu } from 'src/models/menus/menu.model';
import { MenuService } from './../../services/menu.service';

declare const $: any;
declare const jQuery: any;

@Component({
  selector: 'app-menu-diario',
  templateUrl: './menu-diario.component.html',
  styleUrls: ['./menu-diario.component.css']
})
export class MenuDiarioComponent implements OnInit {

  public menus: Menu[] = [];
  public isLoad: boolean = true;
  constructor(
    private menuService: MenuService
  ) { }

  ngOnInit(): void {
    this.cargarMenus()
  }

  cargarMenus(){
    this.isLoad = true;
    this.menuService.cargarMenus()
    .subscribe((menu) => {
      this.menus = menu;
      this.isLoad = false;
      console.log('menus: ',this.menus);
    })
  }

}
