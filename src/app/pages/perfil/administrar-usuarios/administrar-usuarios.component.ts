import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuario } from 'src/models/usuarios/usuario.model';
import { AbstractControlOptions, FormBuilder, FormControl, FormGroup, Validators, ValidationErrors, ValidatorFn, NgForm  } from '@angular/forms';
import { EmpresaService } from 'src/app/services/empresa.service';
import { Empresa } from 'src/models/empresas/empresa.model';
import { UserType } from 'src/models/usuarios/user_type.model';
import { SweetAlert2Helper } from 'src/app/helpers/sweet-alert-2.helper';

declare const $: any;
declare const jQuery: any;

@Component({
  selector: 'app-administrar-usuarios',
  templateUrl: './administrar-usuarios.component.html',
  styleUrls: ['./administrar-usuarios.component.css']
})
export class AdministrarUsuariosComponent implements OnInit {

  public Usuarios: Usuario[] = [];
  public Empresas: Empresa[] = [];
  public UserType: UserType[] = [];
  public empresasFilter: Empresa[] = [];
  public isLoad: boolean = false;
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
    private usuarioService: UsuarioService,
    private fb: FormBuilder,
    private empresaService: EmpresaService,
    private sweetAlert2Helper: SweetAlert2Helper
  ) {
    this.formGroup = this.createFormGroup();
  }

  ngOnInit(): void {
    this.cargarUsuarios();
    this.cargarEmpresas();
    this.cargarUserTypes();
  }

  cargarUsuarios(){
    this.usuarioService.cargarAllUsuarios()
      .subscribe((data: Usuario[]) => {
        this.Usuarios = data;
        console.log('usuarios',this.Usuarios);
        setTimeout(() => {
          this.temp = [...this.Usuarios];
          this.rows = this.Usuarios;
          this.filteredData = [...this.Usuarios];
          this.columnsWithSearch = Object.keys(this.Usuarios[0]);
          this.loadingIndicator = false;
        }, 500);
      }
    );
  }
  cargarEmpresas(){
    this.empresaService.cargarEmpresas()
      .subscribe((data: Empresa[]) => {
        console.log('entro',data);
        this.Empresas = data;
      }
    );
  }
  cargarUserTypes(){
    this.usuarioService.cargarUsersTypes()
      .subscribe((data: UserType[]) => {
        console.log('entro type',data);
        this.UserType = data;
      }
    );
  }

  outsideFilter(e: Event){
    this.isLoad = false;
  }

  searchByEmpresa(event: any){

    // si showAdmins es true, entonces se muestran todos los usuarios
    // si showAdmins es false, entonces se muestran todos los usuarios menos los admins
    const showAdmins = event.target.checked;

    // let filter = event.target.value.toLowerCase();
    let filter = showAdmins ? 'puna administracion' : '';
    console.log('filter =>', this.filteredData);
    this.rows = this.filteredData.filter( (item:any) => {
      if(!filter || (!!item.empresa.name && item.empresa.name.toString().toLowerCase().indexOf(filter) !== -1)) {
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


  createFormGroup(): FormGroup {
    const formGroup = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      lastName: ['', [Validators.required, Validators.minLength(3)]],
      empresaId: ['', Validators.required],
      empresa: ['', Validators.required],
      typeDocument: ['', [Validators.required]],
      document: ['', [Validators.required, Validators.minLength(3)]],
      cuil: ['', [Validators.required, Validators.minLength(3)]],
      typeUser: ['', [Validators.required]],
      password: [''],
    })
    this.onFormGroupChanges(formGroup);
    return formGroup;
  }

  onFormGroupChanges(formGroup: FormGroup) {
    if (!formGroup) return
    formGroup.get('empresa')?.valueChanges.subscribe((val) => {
      const empresa = this.Empresas.find((item) => {
        return item.name.toLowerCase() === val;
      });
      if (empresa) {
        this.formGroup.get('empresaId')?.setValue(empresa.uid);
      }
    })
    // quitar espacios adelante y atras de firstname
    // formGroup.get('firstName')?.valueChanges.subscribe((val) => {
    //   this.formGroup.get('firstName')?.setValue(val.trim());
    // });
    // formGroup.get('document')?.valueChanges.subscribe((val) => {
    //   this.formGroup.get('document')?.setValue(val.trim());
    // });
    // formGroup.get('cuil')?.valueChanges.subscribe((val) => {
    //   this.formGroup.get('cuil')?.setValue(val.trim());
    // });
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
      this.isLoad = false;
      this.empresasFilter = this.Empresas;
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
    this.formGroup.value.password = this.formGroup.value.document;
    console.log(this.formGroup.value);
    this.usuarioService.createUserWithCompany(
      this.formGroup.value,
      this.formGroup.value.empresaId,
      this.formGroup.value.typeUser
    ).subscribe({
      next: (data: any) => {
          console.log(`esto llego`,data);
          this.formSubmitted = false;
          this.formGroup.reset();
          this.cargarUsuarios();
          this.sweetAlert2Helper.success(
            'Usuario creado correctamente',
            'El usuario ha sido creado correctamente',
            ()=>{},
            false
          );
      },
      error: (err: any) => {
        console.log(err);
      },
      complete: () => {
        $('#crearUsuario').modal('hide');
      }
    });

  }

  onDetailToggle(event: any) {
    //console.log('Detail Toggled', event);
  }

  toggleExpandRow(row: any) {
    this.tables?.rowDetail.toggleExpandRow(row);
  }

  resetForm () {
    this.formGroup.reset();
  }

  editarUsuario(usuario: Usuario){

    console.log('editar', usuario);
    this.formGroup.setValue({
      firstName: usuario.firstName,
      lastName: usuario.lastName,
      empresaId: usuario.empresa?.uid,
      empresa: usuario.empresa?.name,
      typeDocument: usuario.typeDocument,
      document: usuario.document,
      cuil: usuario.cuil,
      typeUser: usuario.user_type?.uid,
      password: 'passwrord'
    });
    this.idSelected = usuario.uid;
  }

  submittedEditar() {
    console.log('editar', this.formGroup.value, this.idSelected);

    if (this.formGroup.valid) {
      this.sweetAlert2Helper.question(
        '¿Estas seguro?',
        '¿Estas seguro de editar el registro?',
        'Si, editar',
        'No, cancelar',
        ()=> {
          if (this.formGroup.value.password === '' || this.formGroup.value.password === 'passwrord') {
            this.formGroup.value.password = this.formGroup.value.document;
          }
          // insertar en la base de datos el registro
          this.usuarioService.actualizarUsuario(this.formGroup.value, this.idSelected).subscribe({
            next: (data: any) => {
              this.loadingIndicator = true;
              this.cargarUsuarios();
              this.myNgForm.resetForm();
              this.sweetAlert2Helper.success(
                'Usuario editado correctamente',
                'El usuario ha sido editado correctamente',
                false,
                false
              )
            },
            error: (err: any) => {
              console.log(err)
            },
            complete: () => {
              $('#modalEditarUsuario').modal('hide');
            }
          });
        },
        false
      )
    }

  }

}
