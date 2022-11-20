import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Horarios } from 'src/models/horarios/horarios.model';
import { Usuario } from './../../../../models/usuarios/usuario.model';
import { HorariosService } from './../../../services/horarios.service';
import { AbstractControlOptions, FormBuilder, FormControl, FormGroup, Validators, ValidationErrors, ValidatorFn, NgForm  } from '@angular/forms';
import { SweetAlert2Helper } from 'src/app/helpers/sweet-alert-2.helper';
import { MenuService } from 'src/app/services/menu.service';
import { Menu } from './../../../../models/menus/menu.model';
import { AfternoonSnack } from './../../../../models/menus/afternoonSnack.model';
import { Breakfast } from './../../../../models/menus/breakfast.model';
import { Dinner } from './../../../../models/menus/dinner.model';
import { Lunch } from './../../../../models/menus/lunch.model';
import { combineLatest, Subject, takeUntil } from 'rxjs';

declare const $: any;
declare const jQuery: any;

@Component({
  selector: 'app-configuraciones',
  templateUrl: './configuraciones.component.html',
  styleUrls: ['./configuraciones.component.css']
})
export class ConfiguracionesComponent implements OnInit, OnDestroy {
  public unsubscribe$ = new Subject();
  // variable referente a el usuario actual
  public usuario: Usuario;
  public Horarios: Horarios[] = [];
  public Menues: Menu[] = [];
  public Breakfast: Breakfast[] = [];
  public BreakfastFilter: Breakfast[] = [];
  public AfternoonSnack: AfternoonSnack[] = [];
  public AfternoonSnackFilter: AfternoonSnack[] = [];
  public Dinner: Dinner[] = [];
  public DinnerFilter: Dinner[] = [];
  public Lunch: Lunch[] = [];
  public LunchFilter: Lunch[] = [];
  public isLoad: boolean = false;
  public isLoadBreakfast: boolean = false;
  public isLoadLunch: boolean = false;
  public isLoadAfternoonSnack: boolean = false;
  public isLoadDinner: boolean = false;
  // ? form vars
  @ViewChild('myNgForm') myNgForm!: NgForm;
  public formSubmitted = false;
  public formGroup: FormGroup;
  public idSelected: string | null = null;
  // ? form 2 vars
  @ViewChild('myNgForm2') myNgForm2!: NgForm;
  public formGroup2: FormGroup;
  public idSelected2: string | null = null;
  // ? form 3 vars
  @ViewChild('myNgForm3') myNgForm3!: NgForm;
  public formGroup3: FormGroup;
  public idSelected3: string | null = null;

  constructor(
    private usuarioService: UsuarioService,
    private horariosService: HorariosService,
    private fb: FormBuilder,
    private sweetAlert2Helper: SweetAlert2Helper,
    private menuService: MenuService
  ) {
    this.usuario = this.usuarioService.usuario;
    this.formGroup = this.createFormGroup();
    this.formGroup2 = this.createFormGroup2();
    this.formGroup3 = this.createFormGroup3();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(null);
    this.unsubscribe$.complete();
  }

  ngOnInit(): void {
    console.log(this.usuario);
    this.getData();
  }

  getData():void {
    const $combineLatest = combineLatest([
      this.menuService.cargarMenus(),
      this.horariosService.cargarHorarios(),
      this.menuService.listarBreakfast(),
      this.menuService.listarLunch(),
      this.menuService.listarAfternoonSnack(),
      this.menuService.listarDinner()
    ])
    $combineLatest.pipe(takeUntil(this.unsubscribe$))
    .subscribe({
      next: ([menues, horarios, breakfast, lunch, afternoonSnack, dinner]) => {
        this.Menues = menues;
        this.Horarios = horarios;
        this.Breakfast = breakfast;
        this.Lunch = lunch;
        this.AfternoonSnack = afternoonSnack;
        this.Dinner = dinner;
        this.isLoad = true;
        this.isLoadBreakfast = true;
        this.isLoadLunch = true;
        this.isLoadAfternoonSnack = true;
        this.isLoadDinner = true;
      }
    })
  }

  createFormGroup(): FormGroup {
    const formGroup = this.fb.group({
      horaInicio: ['', [Validators.required]],
      horaFin: ['', [Validators.required]],
    })
    this.onFormGroupChanges(formGroup);
    return formGroup;
  }
  createFormGroup2(): FormGroup {
    const formGroup2 = this.fb.group({
      type: ['', [Validators.required]],
      breakfast: ['', [Validators.required]],
      breakfastId: ['', [Validators.required]],
      lunch: ['', [Validators.required]],
      lunchId: ['', [Validators.required]],
      dinner: ['', [Validators.required]],
      dinnerId: ['', [Validators.required]],
      afternoonSnack: ['', [Validators.required]],
      afternoonSnackId: ['', [Validators.required]],
      quantity: [''],
    });
    this.onFormGroupChanges2(formGroup2);
    return formGroup2;
  }
  createFormGroup3(): FormGroup {
    const formGroup3 = this.fb.group({
      type: ['', [Validators.required]], // 1 = breakfast, 2 = lunch, 3 = afternoonSnack, 4 = dinner
      dish: ['', [Validators.required]], // nombre de el plato
    });
    this.onFormGroupChanges3(formGroup3);
    return formGroup3;
  }

  onFormGroupChanges(formGroup: FormGroup) {}
  onFormGroupChanges2(formGroup: FormGroup) {}
  onFormGroupChanges3(formGroup: FormGroup) {}

  editarMenu(menu: Menu) {
    this.idSelected = menu.uid;
    console.log(menu);
    const findBreakfast = this.Breakfast.find(x => (x.dish).toLowerCase() === (menu.breakfast.dish).toLowerCase());
    const findLunch = this.Lunch.find(x => (x.dish).toLowerCase() === (menu.lunch.dish).toLowerCase());
    const findAfternoonSnack = this.AfternoonSnack.find(x => (x.dish).toLowerCase() === (menu.afternoonSnack.dish).toLowerCase());
    const findDinner = this.Dinner.find(x => (x.dish).toLowerCase() === (menu.dinner.dish).toLowerCase());
    this.formGroup2.setValue({
      type: menu.type,
      breakfast: findBreakfast ? findBreakfast.dish : '',
      breakfastId: findBreakfast ? findBreakfast.uid : '',
      lunch: findLunch ? findLunch.dish : '',
      lunchId: findLunch ? findLunch.uid : '',
      dinner: findDinner ? findDinner.dish : '',
      dinnerId: findDinner ? findDinner.uid : '',
      afternoonSnack: findAfternoonSnack ? findAfternoonSnack.dish : '',
      afternoonSnackId: findAfternoonSnack ? findAfternoonSnack.uid : '',
      quantity: menu.quantity,
    });

  }
  editarHorario(horario: Horarios) {
    $('#modalEditarLabel').html(`Editar Horario ${
      horario.tipo == 'lunch' ? 'almuerzo' :
      horario.tipo == 'breakfast' ? 'desayuno' :
      horario.tipo == 'afternoonSnack' ? 'merienda' :
      horario.tipo == 'dinner' ? 'cena' : ''
    }`);
    this.formGroup.setValue({
      horaInicio: horario.horaInicio,
      horaFin: horario.horaFin
    });
    this.idSelected = horario.uid;
  }

  submitted() { //# HORA
    if (this.formGroup.valid) {
      this.sweetAlert2Helper.question(
        '¿Estas seguro?',
        '¿Estas seguro de editar el registro?',
        'Si, editar',
        'No, cancelar',
        ()=> {
          this.horariosService.actualizarHorario(this.formGroup.value, this.idSelected)
          .subscribe({
            next: (resp: any) => {
              console.log(resp)
              this.formGroup.reset();
              // this.cargarHorarios();
              this.getData();
              this.sweetAlert2Helper.success(
                'Horario editado',
                'El horario fue actualizado correctamente',
                ()=>{},
                false
              );

            },
            error: (err: any) => {
              console.log(err);
            },
            complete: () => {
              $('#modalEditar').modal('hide');
            }
          })
        },
        false
      )
    }
  }

  outsideFilter(e: Event, filter: string) {
    this.isLoad = false;
    switch (filter) {
      case 'breakfast':
        this.isLoadBreakfast = false;
        break;
      case 'lunch':
        this.isLoadLunch = false;
        break;
      case 'afternoonSnack':
        this.isLoadAfternoonSnack = false;
        break;
      case 'dinner':
        this.isLoadDinner = false;
        break;
    }
  }

  handlerChangeBreakfast(event: any){
    const val = event.target.value;
    if (val && val.trim() != '') {
      this.isLoadBreakfast = true;
      this.BreakfastFilter = this.Breakfast.filter((item) => {
        return item.dish.toLowerCase().indexOf(val.toLowerCase()) > -1;
      }).slice(0, 10);
    }
    else {
      this.isLoadBreakfast = false;
      this.BreakfastFilter = this.Breakfast;
    }
  }
  handlerChangeLunch(event: any){
    const val = event.target.value;
    if (val && val.trim() != '') {
      this.isLoadLunch = true;
      this.LunchFilter = this.Lunch.filter((item) => {
        return item.dish.toLowerCase().indexOf(val.toLowerCase()) > -1;
      }).slice(0, 10);
    }
    else {
      this.isLoadLunch = false;
      this.LunchFilter = this.Lunch;
    }
  }
  handlerChangeDinner(event: any){
    const val = event.target.value;
    if (val && val.trim() != '') {
      this.isLoadDinner = true;
      this.DinnerFilter = this.Dinner.filter((item) => {
        return item.dish.toLowerCase().indexOf(val.toLowerCase()) > -1;
      }).slice(0, 10);
    }
    else {
      this.isLoadDinner = false;
      this.DinnerFilter = this.Dinner;
    }
  }
  handlerChangeAfternoonSnack(event: any){
    const val = event.target.value;
    if (val && val.trim() != '') {
      this.isLoadAfternoonSnack = true;
      this.AfternoonSnackFilter = this.AfternoonSnack.filter((item) => {
        return item.dish.toLowerCase().indexOf(val.toLowerCase()) > -1;
      }).slice(0, 10);
    }
    else {
      this.isLoadAfternoonSnack = false;
      this.AfternoonSnackFilter = this.AfternoonSnack;
    }
  }

  selectDish(item: any, filter: string) {
    console.log(item, filter);
    switch (filter) {
      case 'breakfast':
        this.formGroup2.get('breakfast')?.setValue(item.dish);
        this.formGroup2.get('breakfastId')?.setValue(item.uid);
        this.isLoadBreakfast = false;
        break;
      case 'lunch':
        this.formGroup2.get('lunch')?.setValue(item.dish);
        this.formGroup2.get('lunchId')?.setValue(item.uid);
        this.isLoadLunch = false;
        break;
      case 'afternoonSnack':
        this.formGroup2.get('afternoonSnack')?.setValue(item.dish);
        this.formGroup2.get('afternoonSnackId')?.setValue(item.uid);
        this.isLoadAfternoonSnack = false;
        break;
      case 'dinner':
        this.formGroup2.get('dinner')?.setValue(item.dish);
        this.formGroup2.get('dinnerId')?.setValue(item.uid);
        this.isLoadDinner = false;
        break;
    }
  }

  submitEditarMenu() {
    if (this.formGroup2.valid) {
      this.sweetAlert2Helper.question(
        '¿Estas seguro?',
        '¿Estas seguro de editar el registro?',
        'Si, editar',
        'No, cancelar',
        ()=> {
          this.menuService.actualizarMenu(this.formGroup2.value, this.idSelected)
          .subscribe({
            next: (resp: any) => {
              console.log(resp)
              this.formGroup2.reset();
              // this.cargarHorarios();
              this.getData();
              this.sweetAlert2Helper.success(
                'Horario editado',
                'El horario fue actualizado correctamente',
                ()=>{},
                false
              );

            },
            error: (err: any) => {
              console.log(err);
            },
            complete: () => {
              $('#modalEditarMenu').modal('hide');
            }
          })
        },
        false
      )
    }
  }

  submitCrearPlato() {
    if (this.formGroup3.valid) {
      this.sweetAlert2Helper.question(
        '¿Estas seguro?',
        '¿Estas seguro de crear el registro?',
        'Si, crear',
        'No, cancelar',
        ()=> {
          // identificar type
          const type = this.formGroup3.get('type')?.value;
          const dish = this.formGroup3.get('dish')?.value;
          // sin validacion por el momento
          const obj = {
            type: type,
            dish: dish
          }
          this.menuService.crearPlato(obj)
          .subscribe({
            next: (resp: any) => {
              console.log(resp)
              this.formGroup3.reset();
              this.getData();
              this.sweetAlert2Helper.success(
                'Plato creado',
                'El plato fue creado correctamente',
                ()=>{},
                false
              );
              // cerrar modal modalCrearComidas
              $('#modalCrearComidas').modal('hide');
            }
          })
        },
        false
      )
    }
  }

}
