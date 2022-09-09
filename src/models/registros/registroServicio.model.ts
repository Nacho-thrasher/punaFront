import { Menu } from './../menus/menu.model';
import { Breakfast } from './../menus/breakfast.model';
import { Lunch } from './../menus/lunch.model';
import { AfternoonSnack } from '../menus/afternoonSnack.model';
import { Dinner } from './../menus/dinner.model';
import { Empresa } from '../empresas/empresa.model';
import { Usuario } from 'src/models/usuarios/usuario.model';

export class RegistroService {

  constructor(
    public uid: string,
    public date: string,
    public time: string,
    public menu: Menu,
    public breakfast: Breakfast,
    public lunch: Lunch,
    public afternoonSnack: AfternoonSnack,
    public dinner: Dinner,
    public usuario: Usuario,
    public empresa: Empresa,
    public createdBy: Usuario
  ) { }

}
