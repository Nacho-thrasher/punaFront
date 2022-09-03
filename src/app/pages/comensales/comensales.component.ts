import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuario } from 'src/models/usuarios/usuario.model';
import { delay, Subscription } from 'rxjs';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { AbstractControlOptions, FormBuilder, FormControl, FormGroup, Validators, ValidationErrors, ValidatorFn  } from '@angular/forms';
import { EmpresaService } from 'src/app/services/empresa.service';
import { Empresa } from './../../../models/empresas/empresa.model';
import { UserType } from 'src/models/usuarios/user_type.model';

declare const $: any;
declare const jQuery: any;

@Component({
  selector: 'app-comensales',
  templateUrl: './comensales.component.html',
  styleUrls: ['./comensales.component.css']
})
export class ComensalesComponent implements OnInit, OnDestroy {

  //* configuracion de la tabla
  rows: any = [];
  cols:any = [];
  temp: any = [];
  filteredData: any = [];
  columnsWithSearch: string[] = [];
  expanded: any = {};
  loadingIndicator = true;
  reorderable = true;
  ColumnMode = ColumnMode;
  @ViewChild('editTmpl',{static: true}) editTmpl?: TemplateRef<any>;
  @ViewChild('hdrTpl',{static: true}) hdrTpl?: TemplateRef<any>;
  @ViewChild('myTable') table: any;
  @ViewChild(DatatableComponent) tables?: DatatableComponent;
  //* end configuracion de la tabla
  public usuarios: Usuario[] = [];
  public UserType: UserType[] = [];
  public empresas: Empresa[] = [];
  public empresasFilter: Empresa[] = [];
  public isLoad: boolean = false;
  public formSubmitted = false;
  public formGroup: FormGroup;

  constructor(
    private usuarioService: UsuarioService,
    private empresaService: EmpresaService,
    private fb: FormBuilder,
  ) {
    this.formGroup = this.createFormGroup();
  }



  createFormGroup(): FormGroup {
    const formGroup = this.fb.group({
      empresaId: ['', Validators.required],
      empresa: ['', Validators.required],
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      lastName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      typeDocument: ['', [Validators.required]],
      document: ['', [Validators.required, Validators.minLength(3)]],
      cuil: ['', [Validators.required, Validators.minLength(3)]],
    })
    this.onFormGroupChanges(formGroup);
    return formGroup;
  }

  onFormGroupChanges(formGroup: FormGroup): void {
    if (!formGroup) return
    formGroup.get('empresa')?.valueChanges.subscribe((val) => {
      const empresa = this.empresas.find((item) => {
        return item.name.toLowerCase() === val;
      });
      if (empresa) {
        this.formGroup.get('empresaId')?.setValue(empresa.uid);
      }
    })

  }

  ngOnDestroy(): void {
  }

  ngOnInit(): void {
    this.cargarUsuarios();
    this.cargarEmpresas();
    this.cargarUserTypes();
    // ejecutar cerrar filter cuando se haga click fuera del input

  }

  cargarUsuarios(){
    this.usuarioService.cargarUsuariosByType("user")
    .subscribe({
      next: (usuarios) => {
        this.usuarios = usuarios;
        console.log('usuarios comensales: ', this.usuarios);
        setTimeout(() => {
          this.temp = [...this.usuarios];
          this.rows = this.usuarios;
          this.filteredData = [...this.usuarios];
          this.columnsWithSearch = Object.keys(this.rows[0]);
          this.loadingIndicator = false;
        }, 500);
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {
        console.log('complete');
      }
    });
  }

  cargarUserTypes(){
    this.usuarioService.cargarUsersTypes()
      .subscribe((data: UserType[]) => {
        console.log('entro type',data);
        this.UserType = data;
      }
    );
  }

  crearComensal(){
    const comensal = this.formGroup.value;
    // BUSCAR EN USERTYPE EL ID DEL USERTYPE COMENSAL
    const userType = this.UserType.find((item) => {
      return item.name === 'user';
    });
    this.usuarioService.createUserWithCompany(comensal, comensal.empresaId, userType!.uid)
    .subscribe({
      next: (res) => {
        console.log('res: ', res);
        this.formGroup.reset();
        this.formSubmitted = false;
        this.cargarUsuarios();
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {
        console.log('complete');
        // cerrar modal
        $('#crearComensal').modal('hide');
      }

    })

  }

  crearComensalExcel(){
    console.log('crear comensal excel');
  }

  cargarEmpresas(){
    this.empresaService.cargarEmpresas()
    .subscribe((empresa) => {
      this.empresas = empresa;
      this.empresasFilter = empresa;
    })
  }

  handlerChange(event: any){
    const val = event.target.value;
    if (val && val.trim() != '') {
      this.isLoad = true;
      this.empresasFilter = this.empresas.filter((item) => {
        return item.name.toLowerCase().indexOf(val.toLowerCase()) > -1;
      }).slice(0, 10);
    }
    else {
      this.empresasFilter = this.empresas;
      this.isLoad = false;
    }
  }

  selectEmpresa(empresa: Empresa){
    this.isLoad = false;
    this.formGroup.get('empresa')?.setValue(empresa.name);
    this.formGroup.get('empresaId')?.setValue(empresa.uid);
  }

  submitted(){
    this.formSubmitted = true;
    if(this.formGroup.invalid){
      return;
    }
    this.crearComensal();
  }

  // cerrarFilter(){
  //   this.isLoad = false;
  // }

  outsideFilter(e: Event){
    this.isLoad = false;
  }

}
