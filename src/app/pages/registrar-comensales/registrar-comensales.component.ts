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
import { SweetAlert2Helper } from './../../helpers/sweet-alert-2.helper';
import { Subject, takeUntil, combineLatest } from 'rxjs';
import { Empresa } from './../../../models/empresas/empresa.model';
import { EmpresaService } from './../../services/empresa.service';
import { UserType } from './../../../models/usuarios/user_type.model';
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
  public formGroup2: FormGroup;
  public formGroup3: FormGroup;
  public usuarios: Usuario[] = [];
  public usuarioComensal: Usuario | null = null;
  public Empresas: Empresa[] = [];
  public empresasFilter: Empresa[] = [];
  public UserTypes: UserType[] = [];
  public menus: Menu[] = [];
  public registrosDiarios: RegistroService[] = [];
  public ultimoRegistroDiario: RegistroService | null = null;
  public todosRegistrosDiariosDelDia: RegistroService[] = [];
  public cantidadRegistrosDiarios: number = 0;
  public HoraComidaActual: Horarios | null = null;
  // other vars
  public typeDocument: string = 'dni'
  public isLoad: boolean = false;
  // metodo get role
  public roleUser = this.usuarioService.role;
  public isComensal: boolean = false;
  public ultimaComidaNombre: string = '';
  public ultimaComidaTipo: string = '';
  public cargoUsuarioComensal: boolean = false;
  public usuarioComensalDetalle: any | null = null;
  public menuSeleccionado: any | null = null;

  constructor(
    private usuarioService: UsuarioService,
    private fb: FormBuilder,
    private menuService: MenuService,
    private registroDiarioService: RegistroDiarioService,
    private horariosService: HorariosService,
    private sweetAlert2Helper: SweetAlert2Helper,
    private empresaService: EmpresaService
  ) {
    this.formGroup = this.createFormGroup();
    this.formGroup2 = this.createFormGroup2();
    this.formGroup3 = this.createFormGroup3();
  }
  ngOnDestroy(): void {
    this.unsubscribe$.next(null);
    this.unsubscribe$.complete();
  }

  ngOnInit(): void {
    // cargar usuarios comensales
    this.isComensal = this.roleUser == 'comensal';
    this.getData();
  }
  // usar combine latest

  getData():void {
    const $combineLatest = combineLatest([
      this.usuarioService.cargarUsuariosByType("user"),
      this.menuService.cargarMenus(),
      this.registroDiarioService.cargarAllRegistrosDiarios(), // sin all solo trae los del dia actual
      this.horariosService.getCurrentTime(),
      this.empresaService.cargarEmpresas(),
      this.usuarioService.cargarUsersTypes()
    ])
    $combineLatest.pipe(takeUntil(this.unsubscribe$))
    .subscribe({
      next: ([
        usuarios,
        menus,
        registrosDiarios,
        horaComidaActual,
        empresas,
        userTypes
      ]) => {
        this.usuarios = usuarios;
        this.menus = menus; //* menues, saludable etc
        this.todosRegistrosDiariosDelDia = registrosDiarios;
        this.ultimoRegistroDiario = registrosDiarios[registrosDiarios.length - 1];

        this.ultimaComidaTipo =
        Object.keys(this.ultimoRegistroDiario?.breakfast).length > 0 ? 'Desayuno' :
        Object.keys(this.ultimoRegistroDiario?.lunch).length > 0 ? 'Almuerzo' :
        Object.keys(this.ultimoRegistroDiario?.dinner).length > 0 ? 'Cena' :
        Object.keys(this.ultimoRegistroDiario?.afternoonSnack).length > 0 ? 'Merienda' : '';

        this.ultimaComidaNombre =
        Object.keys(this.ultimoRegistroDiario?.breakfast).length > 0 ? this.ultimoRegistroDiario?.breakfast.dish :
        Object.keys(this.ultimoRegistroDiario?.lunch).length > 0 ? this.ultimoRegistroDiario?.lunch.dish :
        Object.keys(this.ultimoRegistroDiario?.dinner).length > 0 ? this.ultimoRegistroDiario?.dinner.dish :
        Object.keys(this.ultimoRegistroDiario?.afternoonSnack).length > 0 ? this.ultimoRegistroDiario?.afternoonSnack.dish : '';


        console.log('ultima comida =>', this.ultimaComidaNombre, this.ultimaComidaTipo);

        this.cantidadRegistrosDiarios = registrosDiarios.length;
        this.registrosDiarios = registrosDiarios.filter((item) => {
          return item.uid != registrosDiarios[registrosDiarios.length - 1].uid;
        });
        this.registrosDiarios.forEach((item, index) => {
          item.nro = index + 1;
        });
        // los ultimos 9 registros diarios
        this.registrosDiarios = this.registrosDiarios.slice(Math.max(this.registrosDiarios.length - 6, 0));
        this.HoraComidaActual = horaComidaActual;
        this.Empresas = empresas;
        this.empresasFilter = empresas;
        this.UserTypes = userTypes;
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
  createFormGroup2(): FormGroup {
    const formGroup2 = this.fb.group({
      nDocumento: ['', [Validators.required]],
      horaMenu: ['', [Validators.required]],
      tipoMenu: ['', [Validators.required]],
      fecha: [''],
    })
    return formGroup2;
  }
  createFormGroup3(): FormGroup {
    const formGroup3 = this.fb.group({
      empresaId: ['', Validators.required],
      empresa: ['', Validators.required],
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      lastName: ['', [Validators.required, Validators.minLength(3)]],
      email: [''],
      typeDocument: ['', [Validators.required]],
      document: ['', [Validators.required, Validators.minLength(3)]],
      cuil: [''],
    })
    this.onFormGroupChanges3(formGroup3);
    return formGroup3;
  }
  onFormGroupChanges(formGroup: FormGroup): void {
    if (!formGroup) return
  }
  onFormGroupChanges3(formGroup3: FormGroup): void {
    if (!formGroup3) return
    formGroup3.get('empresa')?.valueChanges.subscribe((val) => {
      const empresa = this.Empresas.find((item) => {
        return item.name.toLowerCase() === val;
      });
      if (empresa) {
        this.formGroup.get('empresaId')?.setValue(empresa.uid);
      }
    })
  }
  cargarUsuarioComensal(): void {
    //* cargar en la tarjeta el usuario comensal
    const form = this.formGroup.value;
    let ndocu = form.nDocu;
    let menuSelec = form.tipo;
    //* asegurarse que exista ndocu
    if (ndocu) {
      //* pasarle trim para que no tenga espacios
      ndocu = ndocu.trim();
    }
    const usuarioFind = this.usuarios.find((item) => {
      return item.document == ndocu;
    });
    if (usuarioFind) {
      this.cargoUsuarioComensal = true;
      this.usuarioComensalDetalle = usuarioFind;
      //* this.menus
      console.log('acaaaa => ', menuSelec);
      this.menuSeleccionado = this.menus.find((item: any) => {
        console.log('item => ', item);
        if (item.uid == menuSelec) {
          return item;
        }
      });
      this.menuSeleccionado = this.menuSeleccionado[this.HoraComidaActual!.tipo];

    } else {
      this.sweetAlert2Helper.error(
        'error',
        'No se encontro el usuario',
        () => {
          this.cargoUsuarioComensal = false;
        },
        false
      );
    }
  }
  cancelarCargarUsuarioComensal(): void {
    this.cargoUsuarioComensal = false;
  }
  validarDni(): void {
    console.log('validar dni');
    const ndocu = this.formGroup.get('nDocu')?.value;
    if (ndocu.length > 0) {
      if (ndocu.includes('@')) {
        const nDocu = ndocu.split('@')[4];
        this.formGroup.get('nDocu')?.setValue(nDocu);
      }
    }
  }
  registrarComensal(): void {
    console.log('registrar comensal', this.HoraComidaActual);
    if (this.HoraComidaActual == null) {
      this.sweetAlert2Helper.error(
        'error',
        'No se puede registrar el comensal fuera de las horas de comida',
        () => {
          this.cargoUsuarioComensal = false;
          //* resetear el formGroup
          this.formGroup.reset();
        },
        false
      );
      return;
    }

    //* si existe o no usuario
    const dni = this.formGroup.get('nDocu')?.value.trim();
    const usuario = this.usuarios.find((item) => {
      return item.document == (dni).toString();
    });
    this.cargoUsuarioComensal = false;
    if (!usuario) {
      console.log('no existe el usuario');
      this.sweetAlert2Helper.error(
        'Error',
        'No existe el usuario',
        () => {},
        false
      );
    }
    else{
      //* si existe o no registro diario A la misma hora

      const registroExist = this.todosRegistrosDiariosDelDia.filter((item: any) => {
        if (item.usuario.uid == usuario?.uid) {
          return item;
        }
      })

      const horaComidatipo: string = this.HoraComidaActual!.tipo;
      console.log('horaComidatipo', horaComidatipo);



      if (registroExist.length > 0) {
        console.log('existe registro diario =>', {
          horaComidatipo,
          registroExist
        });

        if (horaComidatipo == 'breakfast' && registroExist.find((item: any) => { if (Object.keys(item.breakfast).length > 0) return item })) {
          console.log('ya registro desayuno');
          this.sweetAlert2Helper.error(
            'Error',
            'Ya registro desayuno',
            () => {},
            false
          );
        }
        else if (horaComidatipo == 'lunch' && registroExist.find((item: any) => { if (Object.keys(item.lunch).length > 0) return item })) {
          console.log('ya registro almuerzo');
          this.sweetAlert2Helper.error(
            'Error',
            'Ya registro almuerzo',
            () => {},
            false
          );
        }
        else if (horaComidatipo == 'dinner' && registroExist.find((item: any) => { if (Object.keys(item?.dinner).length > 0) return item })) {
          console.log('ya registro cena');
          this.sweetAlert2Helper.error(
            'Error',
            'Ya registro cena',
            () => {},
            false
          );
        }
        else if (horaComidatipo == 'afternoonSnack' && registroExist.find((item: any) => {
          if (Object.keys(item.afternoonSnack).length > 0) return item
        })) {
          console.log('ya registro merienda');
          this.sweetAlert2Helper.error(
            'Error',
            'Ya registro merienda',
            () => {},
            false
          );
        }
        else{
          this.usuarioComensal = usuario;
          //* 1 armar objeto a mandar
          const args = {
            idUser: this.usuarioComensal.uid,
            idMenu: this.formGroup.value.tipo,
            idCompany: this.usuarioComensal!.empresa!.uid,
          }
          console.log('mostrar se envio: ', args);
          //* 2 mandar objeto a servicio
          this.registroDiarioService.crearRegistroDiario(args)
          .subscribe({
            next: (res) => {
              console.log('registro diario: ', res);
              this.formSubmitted = true;
              this.sweetAlert2Helper.success(
                'Registro exitoso',
                'El registro se realizo correctamente',
                () => {
                  this.formGroup.reset();
                  this.formSubmitted = false;
                },
                false
              );
            },
            error: (err) => {
              console.log(err);
              this.sweetAlert2Helper.error(
                'Error',
                'No se pudo registrar el comensal',
                () => {},
                false
              );
              return
            },
            complete: () => {
              this.getData();
            }
          })
        }
      }
      else{
        this.usuarioComensal = usuario;
        //* 1 armar objeto a mandar
        const args = {
          idUser: this.usuarioComensal.uid,
          idMenu: this.formGroup.value.tipo,
          idCompany: this.usuarioComensal!.empresa!.uid,
        }
        console.log('mostrar se envio: ', args);
        //* 2 mandar objeto a servicio
        this.registroDiarioService.crearRegistroDiario(args)
        .subscribe({
          next: (res) => {
            console.log('registro diario: ', res);
            this.formSubmitted = true;
            this.sweetAlert2Helper.success(
              'Registro exitoso',
              'El registro se realizo correctamente',
              () => {
                this.formGroup.reset();
                this.formSubmitted = false;
              },
              false
            );
          },
          error: (err) => {
            console.log(err);
            this.sweetAlert2Helper.error(
              'Error',
              'No se pudo registrar el comensal',
              () => {},
              false
            );
            return
          },
          complete: () => {
            this.getData();
          }
        })
      }
      // borrar inputs del formulario
      this.formGroup.get('nDocu')?.setValue('');
      this.formGroup.get('tipo')?.setValue('');
    }

  }

  selectRadio(menu: any) {
    console.log('menu', menu);
    this.formGroup.get('tipo')?.setValue(menu.uid);
    // seleccionar radio button
    $(`#${menu.type}`).prop('checked', true);

  }

  handleClick(number: number): void {
    // setear a ndocu el valor despues del anterior valor
    const oldValue = this.formGroup.get('nDocu')?.value || '';
    const newValue = `${oldValue}${number}`;

    this.formGroup.get('nDocu')?.setValue(newValue);



    // this.formGroup.get('nDocu')?.setValue(newValue);
  }
  handleBorrar(): void {
    // borrar el ultimo valor del ndocu
    const oldValue = this.formGroup.get('nDocu')?.value;
    const newValue = oldValue.slice(0, -1);
    console.log('newValue:', newValue);
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
    if (this.formGroup2.valid) {
      const documento = this.formGroup2.get('nDocumento')?.value
      const usuario = this.usuarios.find((item) => {
        return item.document == (documento).toString().trim();
      });
      if (!usuario) {
        console.log('no existe el usuario');
        this.sweetAlert2Helper.error(
          'Error',
          'No existe el usuario',
          () => {},
          false
        );
        return
      }
      this.usuarioComensal = usuario;
      const fecha = this.formGroup2.get('fecha')?.value ? this.formGroup2.get('fecha')?.value.split('-').reverse().join('/') : new Date().toLocaleDateString('es-AR',
       {
        timeZone: 'America/Argentina/Buenos_Aires',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
       }
      );
      const args = {
        idUser: usuario!.uid,
        horaMenu: this.formGroup2.get('horaMenu')?.value,
        tipoMenu: this.formGroup2.get('tipoMenu')?.value,
        idCompany: this.usuarioComensal!.empresa!.uid,
        fecha: fecha,
      }
      this.registroDiarioService.crearRegistroManual(args)
      .subscribe({
        next: (res) => {
          console.log('registro diario: ', res);
          this.formSubmitted = true;
          this.sweetAlert2Helper.success(
            'Registro exitoso',
            'El registro se realizo correctamente',
            () => {
              this.formGroup2.reset();
              this.formSubmitted = false;
            },
            false
          );
        },
        error: (err) => {
          console.log(err);
          this.formGroup2.reset();
          this.sweetAlert2Helper.error(
            'Error',
            'No se pudo registrar el comensal',
            () => {},
            false
          );
        },
        complete: () => {
          //* reset form
          this.formGroup2.reset();
          this.getData();
        }
      })
      this.formGroup.reset();
      $('#modalCrearRegistroManual').modal('hide');
    }
  }

  crearComensal(): void {
    const comensal = this.formGroup3.value;
    comensal.cuil = this.formGroup3.get('document')?.value;
    const userType = this.UserTypes.find((item) => {
      return item.name === 'user';
    });
    this.usuarioService.createUserWithCompany(comensal, comensal.empresaId, userType!.uid)
    .subscribe({
      next: (res) => {
        console.log(res);
        this.sweetAlert2Helper.success(
          'Comensal creado',
          'El comensal se creo correctamente',
          () => {
            this.formGroup.reset();
            this.formSubmitted = false;
            this.getData();
          },
          false
        );
      },
      error: (err) => {
        console.log(err);
        this.sweetAlert2Helper.error(
          'Error',
          'No se pudo crear el comensal',
          () => {},
          false
        );
      },
      complete: () => {
        console.log('complete');
        $('#crearComensal').modal('hide');
      }
    })
  }

  handlerChange(event: any){
    const val = event.target.value;
    if (val && val.trim() != '') {
      this.isLoad = true;
      this.empresasFilter = this.Empresas.filter((item) => {
        return item.name.toLowerCase().indexOf(val.toLowerCase()) > -1;
      }).slice(0, 10);
    }
    else {
      this.empresasFilter = this.Empresas;
      this.isLoad = false;
    }
  }

  outsideFilter(e: Event){
    this.isLoad = false;
  }

  selectEmpresa(empresa: Empresa){
    this.isLoad = false;
    this.formGroup3.get('empresa')?.setValue(empresa.name);
    this.formGroup3.get('empresaId')?.setValue(empresa.uid);
    console.log('empresa: ', empresa);
  }

  submitted(){
    this.formSubmitted = true;
    if(this.formGroup3.invalid){
      return;
    }
    this.crearComensal();
  }


}

