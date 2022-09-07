import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControlOptions, FormBuilder, FormControl, FormGroup, Validators, ValidationErrors, ValidatorFn  } from '@angular/forms';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuario } from 'src/models/usuarios/usuario.model';
import { MenuService } from './../../services/menu.service';
import { Menu } from './../../../models/menus/menu.model';
import { RegistroDiarioService } from './../../services/registro-diario.service';
import { RegistroService } from 'src/models/registros/registroServicio.model';
import { HorariosService } from './../../services/horarios.service';
import { Horarios } from 'src/models/horarios/horarios.model';
import { Subject, takeUntil, combineLatest } from 'rxjs';

declare const $: any;
declare const jQuery: any;

@Component({
  selector: 'app-registrar-comensales',
  templateUrl: './registrar-comensales.component.html',
  styleUrls: ['./registrar-comensales.component.css']
})
export class RegistrarComensalesComponent implements OnInit, OnDestroy {
  public unsubscribe$ = new Subject();
  // fecha formato: lunes 1 de enero de 2020
  public fechaHoy: string = new Date().toLocaleDateString('es-AR', {
    // dia de la semaan en letras
    weekday: 'long',
    // dia del mes
    day: 'numeric',
    // mes en letras
    month: 'long',
  });
  public formSubmitted = false;
  public formGroup: FormGroup;
  public usuarios: Usuario[] = [];
  public usuarioComensal: Usuario | null = null;
  public menus: Menu[] = [];
  public registrosDiarios: RegistroService[] = [];
  public ultimoRegistroDiario: RegistroService | null = null;
  public cantidadRegistrosDiarios: number = 0;
  public HoraComidaActual: Horarios | null = null;
  // other vars
  public typeDocument: string = 'dni'

  constructor(
    private usuarioService: UsuarioService,
    private fb: FormBuilder,
    private menuService: MenuService,
    private registroDiarioService: RegistroDiarioService,
    private horariosService: HorariosService
  ) {
    this.formGroup = this.createFormGroup();
  }
  ngOnDestroy(): void {
    this.unsubscribe$.next(null);
    this.unsubscribe$.complete();
  }

  ngOnInit(): void {
    // cargar usuarios comensales
    this.getData();
  }
  // usar combine latest

  getData():void {
    const $combineLatest = combineLatest([
      this.usuarioService.cargarUsuariosByType("user"),
      this.menuService.cargarMenus(),
      this.registroDiarioService.cargarAllRegistrosDiarios(),
      this.horariosService.getCurrentTime()
    ])
    $combineLatest.pipe(takeUntil(this.unsubscribe$))
    .subscribe({
      next: ([usuarios, menus, registrosDiarios, horaComidaActual]) => {
        this.usuarios = usuarios;
        this.menus = menus;
        this.ultimoRegistroDiario = registrosDiarios[registrosDiarios.length - 1];
        this.cantidadRegistrosDiarios = registrosDiarios.length;
        this.registrosDiarios = registrosDiarios.filter((item) => {
          return item.uid != registrosDiarios[registrosDiarios.length - 1].uid;
        });
        this.HoraComidaActual = horaComidaActual;
      }
    })
  }

  createFormGroup(): FormGroup {
    const formGroup = this.fb.group({
      nDocu: ['', [Validators.required, Validators.minLength(3)]],
      tipo: ['', [Validators.required]],
    })
    this.onFormGroupChanges(formGroup);
    return formGroup;
  }

  onFormGroupChanges(formGroup: FormGroup): void {
    if (!formGroup) return
    // formGroup.get('nDocu')?.valueChanges.subscribe((val) => {
    //   this.formGroup.get('nDocu')?.setValue(val.trim());
    // });
  }

  registrarComensal(): void {
    // usuario comensal
    const dni = this.formGroup.get('nDocu')?.value;
    // buscar con find en this usuarios el usuario con el dni
    const usuario = this.usuarios.find((item) => {
      return item.document == (dni).toString();
    });
    if (!usuario) {
      console.log('no existe el usuario');
    }
    else{
      this.usuarioComensal = usuario;
      //* 1 armar objeto a mandar
      const args = {
        idUser: this.usuarioComensal.uid,
        idMenu: this.formGroup.value.tipo,
        idCompany: this.usuarioComensal!.empresa!.uid,
      }
      console.log('mostrar args: ', args);
      //* 2 mandar objeto a servicio
      this.registroDiarioService.crearRegistroDiario(args)
      .subscribe({
        next: (res) => {
          console.log('registro diario: ', res);
          this.formSubmitted = true;
        },
        error: (err) => {
          console.log(err);
        },
        complete: () => {
          this.getData();
        }
      })

      // borrar inputs del formulario
      this.formGroup.get('nDocu')?.setValue('');
      this.formGroup.get('tipo')?.setValue('');
    }

  }

  handleClick(number: number): void {
    // setear a ndocu el valor despues del anterior valor
    const oldValue = this.formGroup.get('nDocu')?.value;
    const newValue = oldValue + number;
    this.formGroup.get('nDocu')?.setValue(newValue);
  }
  handleBorrar(): void {
    // borrar el ultimo valor del ndocu
    const oldValue = this.formGroup.get('nDocu')?.value;
    const newValue = oldValue.slice(0, -1);
    this.formGroup.get('nDocu')?.setValue(newValue);
  }

  cambiarTypeDocument(tipo: string): void {
    // si es dni
    if (tipo == 'dni') {
      this.formGroup.get('nDocu')?.setValidators([Validators.required, Validators.minLength(3)]);
      this.typeDocument = 'dni';
    }
    else if (tipo == 'pasaporte') {
      // escribir en tag id dropdownMenuButton pasaporte
      this.typeDocument = 'pasaporte'

    }

  }

  crearRegistroManual(): void {

  }

}

