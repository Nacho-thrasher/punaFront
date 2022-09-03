import { Lunch } from './lunch.model';
import { Dinner } from './dinner.model';
import { Breakfast } from './breakfast.model';
import { AfternoonSnack } from './afternoonSnack.model';

export class Menu {

  constructor(
    public uid: string,
    public date: string,
    public type: string,
    public breakfast: Breakfast,
    public lunch: Lunch,
    public dinner: Dinner,
    public afternoonSnack: AfternoonSnack,
    public quantity: number,
  ){}

}
