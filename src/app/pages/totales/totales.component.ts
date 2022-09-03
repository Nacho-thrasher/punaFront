import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { UsuarioService } from 'src/app/services/usuario.service';
import { SweetAlert2Helper } from 'src/app/helpers/sweet-alert-2.helper';
import { Usuario } from 'src/models/usuarios/usuario.model';
import { RegistroDiarioService } from './../../services/registro-diario.service';
import { ActivatedRoute, Router } from '@angular/router';

declare const $: any;
declare const jQuery: any;

@Component({
  selector: 'app-totales',
  templateUrl: './totales.component.html',
  styleUrls: ['./totales.component.css']
})
export class TotalesComponent implements OnInit, OnDestroy {

  public TotalesMeses: any[] = [];
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
  @ViewChild('nameSummaryCell', {static: true}) nameSummaryCell?: TemplateRef<any>;

  constructor(
    private registroDiarioService: RegistroDiarioService,
    private usuarioService: UsuarioService
  ) { }

  ngOnDestroy(): void {

  }

  ngOnInit(): void {
    this.cargarTotalesMeses();
  }

  cargarTotalesMeses() {
    this.registroDiarioService.cargarTotalesPorMeses()
    .subscribe({
      next: (resp: any) => {
        this.TotalesMeses = resp;
        setTimeout(() => {
          this.temp = [...this.TotalesMeses];
          this.rows = this.TotalesMeses;
          this.filteredData = [...this.TotalesMeses];
          this.columnsWithSearch = Object.keys(this.TotalesMeses[0]);
          this.loadingIndicator = false;
        }, 500);
      }
    });
  }

  onDetailToggle(event: any) {
    //console.log('Detail Toggled', event);
  }

  toggleExpandRow(row: any) {
    this.tables?.rowDetail.toggleExpandRow(row);
  }


}
