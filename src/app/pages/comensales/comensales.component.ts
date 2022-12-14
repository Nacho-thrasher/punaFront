import { Component, ElementRef, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuario } from 'src/models/usuarios/usuario.model';
import { delay, Subscription, Observable, of, pipe, from, Subject, mergeMap, concatMap } from 'rxjs';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { AbstractControlOptions, FormBuilder, FormControl, FormGroup, Validators, ValidationErrors, ValidatorFn  } from '@angular/forms';
import { EmpresaService } from 'src/app/services/empresa.service';
import { Empresa } from './../../../models/empresas/empresa.model';
import { UserType } from 'src/models/usuarios/user_type.model';
import * as XLSX from 'xlsx';
import { SweetAlert2Helper } from './../../helpers/sweet-alert-2.helper';
import Swal from 'sweetalert2';

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
  //* vars excell
  public file!: File;
  public JSONObject = {
    object: {},
    string: ''
  };
  keys!: string[];
  @ViewChild('inputFile') inputFile!: ElementRef;
  isExcelFile!: boolean;
  spinnerEnabled = false;
  dataSheet:any = new Subject();
  public arrayBuffer: any;
  public str!: any;
  public jsonData: any = [];
  //* vars preload excel
  public subiendoData: boolean = false;
  public numeroData: number = 0;
  public totalData: number = 0;
  public fileName: string = 'Buscar archivo';

  constructor(
    private usuarioService: UsuarioService,
    private empresaService: EmpresaService,
    private fb: FormBuilder,
    private sweetAlert2Helper: SweetAlert2Helper
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


  searchByEmpresa(event: any){


    let filter = event.target.value.toLowerCase();

    this.rows = this.filteredData.filter( (item:any) => {
      if (item.empresa.name.toLowerCase().indexOf(filter) !== -1) {
        return true;
      }
      return;
    });

  }

  updateFilter(event: any) {
    // get the value of the key pressed and make it lowercase
    let filter = event.target.value.toLowerCase();
    // assign filtered matches to the active datatable
    this.rows = this.filteredData.filter( (item:any) => {
      // iterate through each row's column data
      for (let i = 0; i < this.columnsWithSearch.length; i++){
        var colValue = item[this.columnsWithSearch[i]];
        // if no filter OR colvalue is NOT null AND contains the given filter
        if(!filter || (!!colValue && colValue.toString().toLowerCase().indexOf(filter) !== -1)) {
          // found match, return true to add to result set
          return true;
        }
      }
      return;
    });
    // TODO - whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }

  ngOnDestroy(): void {
  }

  ngOnInit(): void {
    this.cargarUsuarios();
    this.cargarEmpresas();
    this.cargarUserTypes();

    //* cambiar por id el nombre de boton
    $('#inputGroupFile01').text('Elegir');
  }

  cargarUsuarios(){
    this.usuarioService.cargarUsuariosByType("user")
    .subscribe({
      next: (usuarios) => {
        this.usuarios = usuarios;
        if (this.usuarios.length == 0) {
          setTimeout(() => {
            this.temp = [];
            this.rows = [];
            this.filteredData = [];
            this.columnsWithSearch = Object.keys([]);
            this.loadingIndicator = false;
          }, 500);
        }
        else {
          console.log('usuarios comensales: ', this.usuarios);
          setTimeout(() => {
            this.temp = [...this.usuarios];
            this.rows = this.usuarios;
            this.filteredData = [...this.usuarios];
            this.columnsWithSearch = Object.keys(this.rows[0]);
            this.loadingIndicator = false;
          }, 500);
        }
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
    console.log('empresa: ', empresa);
  }

  submitted(){
    this.formSubmitted = true;
    if(this.formGroup.invalid){
      return;
    }
    this.crearComensal();
  }

  outsideFilter(e: Event){
    this.isLoad = false;
  }

  upload(event:any) {

    //* cargar nombre de archivo
    this.fileName = event.target.files[0].name;
    // si ya hay un archivo cargado, resetear
    console.log('event: ', event);
    this.file = event.target.files[0];
    if (event.target.files.length > 1) {
      this.inputFile.nativeElement.value = '';
    }
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      this.arrayBuffer = fileReader.result;
      const data = new Uint8Array(this.arrayBuffer);
      const arr = new Array();
      for (let i = 0; i !== data.length; ++i) {
        arr[i] = String.fromCharCode(data[i]);
      }
      this.str = arr.join('');
      const workbook = XLSX.read(btoa(this.str), { type: 'base64' });
      const first_sheet_name = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[first_sheet_name];
      const json = XLSX.utils.sheet_to_json(worksheet, { raw: true });
      console.log('json: ', json);
      this.jsonData = json;

    }
    fileReader.readAsArrayBuffer(this.file);

  }
  submitExcel(){
    let linea = 0;
    const nameColumn = Object.keys(this.jsonData[0]);
    const nuevoJson = this.jsonData.map((item: any) => {
      linea++;
      console.log('item: ', item);
      if(!item[nameColumn[5]]){
        this.sweetAlert2Helper.error(
          'Error',
          `Falta el campo Nro. Doc. en la linea ${linea}`,
          ()=>{},
          false
        )
        return
      }
      if(!item[nameColumn[2]]) {
        this.sweetAlert2Helper.error(
          'Error',
          `Falta el campo ${nameColumn[2]} en la linea ${linea}`,
          ()=>{},
          false
        )
        return
      }
      if(!item[nameColumn[1]]) {
        this.sweetAlert2Helper.error(
          'Error',
          `Falta el campo ${nameColumn[1]} en la linea ${linea}`,
          ()=>{},
          false
        )
        return
      }

      const fullName = item[nameColumn[2]].toLowerCase();
      let firstName; let lastName;
      if (fullName.includes(',')) {
        firstName = fullName.split(',')[1].trim();
        lastName = fullName.split(',')[0].trim();
      } else {
        let nospaces = fullName.trim();
        firstName = nospaces.split(' ')[0].trim();
        lastName = nospaces.split(' ')[1].trim();
      }
      console.log('firstName: ', firstName, 'lastName: ', lastName);
      return {
        contratista: item[nameColumn[0]].toLowerCase(),
        cuit: item[nameColumn[1]].toLowerCase(),
        empleado: item[nameColumn[2]].toLowerCase(),
        firstName: firstName,
        lastName: lastName,
        cuil: (item[nameColumn[3]]).toString() || (item[nameColumn[5]]).toString(),
        tipoDocumento: item[nameColumn[4]].toLowerCase(),
        numeroDocumento: (item[nameColumn[5]]).toString(),
        linea: linea
      }
    })
    // recortar json tomar los 5 primeros
    const empresaId = this.formGroup.get('empresaId')?.value;
    if (!empresaId) {
      this.sweetAlert2Helper.warning(
        'Debe seleccionar una empresa',
        'Debe seleccionar una empresa para poder cargar los comensales',
        ()=>{},
        false
      );
      return
    }
    const toast = Swal.mixin({
      title: 'Cargando comensales',
      html: 'No cierre esta ventana',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
    // const fiveItems = nuevoJson.slice(0, 5);
    // console.log('nuevoJson: ', fiveItems);
    // convertir array de json a array de observables
    let errorIndex = 0;
    of(nuevoJson).pipe(
      // recorrer y esperar a que termine cada uno
      mergeMap((item) => {
        toast.fire();
        return item;
      }),
      // ejecutar cada uno de los observables
      concatMap((item) => {
        errorIndex++;
        return this.usuarioService.crearComensalesExcel(item, empresaId);
      })
    ).subscribe({
      next: (res) => {
        console.log('res: ', res);
      },
      error: (err) => {
        console.log(err);
        // cerrar modal en error index
        $('#crearComensal').modal('hide');
        this.sweetAlert2Helper.error(
          'Error al cargar los comensales',
          `${err.error.msg} ${errorIndex}`,
          ()=>{},
          false
        );
        return
      },
      complete: () => {
        console.log('complete');
        this.cargarUsuarios();
        // cerrar modal
        $('#importarExcel').modal('hide');
        toast.close();
      }
    })

  }

}
