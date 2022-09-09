import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuario } from 'src/models/usuarios/usuario.model';
import { AbstractControlOptions, FormBuilder, FormControl, FormGroup, Validators, ValidationErrors, ValidatorFn, NgForm  } from '@angular/forms';
import { EmpresaService } from 'src/app/services/empresa.service';
import { Empresa } from 'src/models/empresas/empresa.model';
import { UserType } from 'src/models/usuarios/user_type.model';
import { SweetAlert2Helper } from 'src/app/helpers/sweet-alert-2.helper';
import { ExtrasService } from './../../services/extras.service';

declare const $: any;
declare const jQuery: any;

@Component({
  selector: 'app-extras',
  templateUrl: './extras.component.html',
  styleUrls: ['./extras.component.css']
})
export class ExtrasComponent implements OnInit {

  public Extras: any[] = [];
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
    private fb: FormBuilder,
    private extrasService: ExtrasService,
    private sweetAlert2Helper: SweetAlert2Helper

  ) {
    this.formGroup = this.createFormGroup();
  }

  ngOnInit(): void {
    this.cargarExtras()
  }

  cargarExtras() {
    this.extrasService.getExtras()
    .subscribe({
      next: (resp: any) => {
        this.Extras = resp;
        if (this.Extras.length == 0) {
          setTimeout(() => {
            this.temp = [];
            this.rows = [];
            this.filteredData = [];
            this.columnsWithSearch = Object.keys([]);
            this.loadingIndicator = false;
          }, 500);
        }
        else {
          setTimeout(() => {
            this.temp = [...this.Extras];
            this.rows = this.Extras;
            this.filteredData = [...this.Extras];
            this.columnsWithSearch = Object.keys(this.Extras[0]);
            this.loadingIndicator = false;
          }, 500);
        }
      },
      error: (err: any) => {
        console.log(err);
      }
    })

  }

  createFormGroup(): FormGroup {
    const formGroup = this.fb.group({
      empresa: ['', [Validators.required, Validators.minLength(3)]],
      fecha: ['', [Validators.required]],
      cantServ: ['', Validators.required],
      usuario: ['', Validators.required],
      detalle: ['', [Validators.required]],
    })
    this.onFormGroupChanges(formGroup);
    return formGroup;
  }

  onFormGroupChanges(formGroup: FormGroup) {}

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

  editForm(data: any){
    const fecha = new Date(data.fecha);
    this.formGroup.setValue({
      empresa: data.empresa,
      fecha: fecha,
      cantServ: data.cantServ,
      usuario: data.usuario,
      detalle: data.detalle,
    });
    this.idSelected = data.uid;
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

  submitted() {
    if (this.formGroup.valid) {
      this.formSubmitted = true;
      const data = this.formGroup.value;
      // fecha dd/mm/yyyy
      const fecha = data.fecha.split('-').reverse().join('/');
      console.log(data);
      const args = {
        ...data,
        fecha: fecha,
      }
      this.extrasService.createExtra(args)
      .subscribe({
        next: (resp: any) => {
          this.sweetAlert2Helper.success(
            'Creado',
            'Extra creado correctamente',
            ()=> {
              this.cargarExtras();
              this.resetForm();
            },
            false
          );

        },
        error: (err: any) => {
          console.log(err);
        },
        complete: () => {
            $('#crear').modal('hide');
        }
      })
    }
  }

  submittEdit() {
    if (this.formGroup.valid) {
      this.formSubmitted = true;
      const data = this.formGroup.value;
      // fecha dd/mm/yyyy
      const fecha = data.fecha.split('-').reverse().join('/');
      console.log(data);
      const args = {
        ...data,
        fecha: fecha,
      }
      console.log(console.log(this.idSelected));
      this.extrasService.putExtra(this.idSelected, args)
      .subscribe({
        next: (resp: any) => {
          this.sweetAlert2Helper.success(
            'Actualizado',
            'Extra actualizado correctamente',
            ()=> {
              this.cargarExtras();
              this.resetForm();
            },
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
    }
  }

  deleteExtra(data: any) {
    const id = data.uid;
    this.sweetAlert2Helper.question(
      '¿Estás seguro?',
      'No podrás revertir esto',
      'confirmar',
      'cancelar',
      ()=> {
        this.extrasService.deleteExtra(id)
        .subscribe({
          next: (resp: any) => {
            this.sweetAlert2Helper.success(
              'Eliminado',
              'Extra eliminado correctamente',
              ()=> {
                this.cargarExtras();
              },
              false
            );
          },
          error: (err: any) => {
            console.log(err);
          }
        })
      },
      ()=> {
        console.log('cancelar');
      }

    )


  }


}
