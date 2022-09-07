import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { EmpresaService } from 'src/app/services/empresa.service';
import { Empresa } from './../../../models/empresas/empresa.model';
import { delay, Subscription } from 'rxjs';
import { SweetAlert2Helper } from 'src/app/helpers/sweet-alert-2.helper';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuario } from 'src/models/usuarios/usuario.model';
import { AbstractControlOptions, FormBuilder, FormControl, FormGroup, Validators, ValidationErrors, ValidatorFn, NgForm  } from '@angular/forms';

declare const $: any;
declare const jQuery: any;

@Component({
  selector: 'app-empresas',
  templateUrl: './empresas.component.html',
  styleUrls: ['./empresas.component.css']
})
export class EmpresasComponent implements OnInit {

  public empresas: Empresa[] = [];
  public empresasFilter: Empresa[] = [];
  public isLoad: boolean = false;
  //? variables para empresas seleccionadas
  public EmpresasSelected: Empresa[] = []

  // ? Datatables vars
  rows: any[] = [];
  filteredData: any[] = [];
  columnsWithSearch: string[] = [];
  temp: any[] = [];
  cols: any[] = [];
  expanded: any = {};
  loadingIndicator: boolean = true;
  reorderable: boolean = true;
  columnMode = ColumnMode;
  @ViewChild('editTmpl', {static: true}) editTmpl?: TemplateRef<any>;
  @ViewChild('hdrTpl', {static: true}) hdrTpl?: TemplateRef<any>;
  @ViewChild('myTable') table?: any;
  @ViewChild(DatatableComponent) tables?: DatatableComponent;
  // ? end Datatables vars
  @ViewChild('myNgForm') myNgForm!: NgForm;
  public formSubmitted = false;
  public formGroup: FormGroup;
  public idSelected: string | null = null;

  constructor(
    private empresaService: EmpresaService,
    private route: ActivatedRoute,
    private router: Router,
    private sweetAlert2Helper: SweetAlert2Helper,
    private fb: FormBuilder,
  ) {
    this.formGroup = this.createFormGroup();
  }

  ngOnInit(): void {
    this.cargarEmpresas();
  }

  cargarEmpresas(){
    this.isLoad = true;
    this.empresaService.cargarEmpresas()
    .subscribe({
      next: (resp: any) => {
        this.empresas = resp;
        if(this.empresas.length == 0) {
          // cargar sin datos
          setTimeout(() => {
            this.temp = [];
            this.rows = [];
            this.filteredData = [];
            this.columnsWithSearch = Object.keys([]);
            this.loadingIndicator = false;
          }, 500);
        } else {
          setTimeout(() => {
            this.temp = [...this.empresas];
            this.rows = this.empresas;
            this.filteredData = [...this.empresas];
            this.columnsWithSearch = Object.keys(this.empresas[0]);
            this.loadingIndicator = false;
          }, 500);
        }
      }
    })
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


  createFormGroup(): FormGroup {
    const formGroup = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(3)]],
      city: ['', Validators.required],
      direction: ['', Validators.required],
      cuit: ['', [Validators.required, Validators.minLength(3)]],
      contratista: [''],
      idContratista: [''],
    })
    this.onFormGroupChanges(formGroup);
    return formGroup;
  }

  onFormGroupChanges(formGroup: FormGroup) {}

  crearEmpresa() {
    if (this.formGroup.valid) {
      console.log('formGroup', this.formGroup.value);
      this.empresaService.crearEmpresa(this.formGroup.value)
      .subscribe({
        next: (resp: any) => {
          this.sweetAlert2Helper.success(
            'Empresa creada',
            `La empresa ha sido creada con éxito`,
            () => {},
            false
          );
          this.cargarEmpresas();
          this.formGroup.reset();
        }
      })

    }
    $('#crearEmpresa').modal('hide');
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
      this.isLoad = false;
      this.empresasFilter = this.empresas;
    }
  }
  outsideFilter(e: Event){
    this.isLoad = false;
  }

  selectEmpresa(empresa: Empresa){
    this.isLoad = false;
    this.formGroup.get('contratista')?.setValue(empresa.name);
    this.formGroup.get('idContratista')?.setValue(empresa.uid);
  }

  editarEmpresa(empresa: Empresa){
    this.formGroup.setValue({
      name: empresa.name,
      description: empresa.description,
      city: empresa.city,
      direction: empresa.direction,
      cuit: empresa.cuit,
      contratista: empresa.contratista.name || '',
      idContratista: empresa.contratista.uid || '',
    });
    this.idSelected = empresa.uid;
  }

  submitEditarEmpresa(){
    if (this.formGroup.valid) {
      this.sweetAlert2Helper.question(
        '¿Estas seguro?',
        '¿Estas seguro de editar el registro?',
        'Si, editar',
        'No, cancelar',
        ()=> {
          // insertar en la base de datos el registro
          this.empresaService.editarEmpresa(this.formGroup.value, this.idSelected).subscribe({
            next: (data: any) => {
              this.sweetAlert2Helper.success(
                'Empresa editada',
                'La empresa ha sido editada con éxito',
                false,
                false
              )
              this.loadingIndicator = true;
              this.cargarEmpresas();
              this.formGroup.reset();
            },
            error: (err: any) => {
              console.log(err)
            },
            complete: () => {
              $('#modalEditarEmpresa').modal('hide');
            }
          });
        },
        false
      )
    }
  }
  resetForm () {
    this.formGroup.reset();
  }

}
