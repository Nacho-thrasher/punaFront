import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { RegistroService } from './../../../models/registros/registroServicio.model';
import { RegistroDiarioService } from './../../services/registro-diario.service';

declare const $: any;
declare const jQuery: any;

@Component({
  selector: 'app-lista-comensales',
  templateUrl: './lista-comensales.component.html',
  styleUrls: ['./lista-comensales.component.css']
})
export class ListaComensalesComponent implements OnInit {

  public Registros: RegistroService[] = [];
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

  constructor(
    private registroService: RegistroDiarioService
  ) { }

  ngOnInit(): void {
    this.cargarRegistros();
  }

  cargarRegistros() {
    this.registroService.cargarAllRegistrosDiarios(true)
    .subscribe({
      next: (data) => {
        this.Registros = data;
        console.log(this.Registros);
        setTimeout(() => {
          this.temp = [...this.Registros];
          this.rows = this.Registros;
          this.filteredData = [...this.Registros];
          this.columnsWithSearch = Object.keys(this.Registros[0]);
          this.loadingIndicator = false;
        }, 500);
      }
    })
  }

  onDetailToggle(event: any) {
    //console.log('Detail Toggled', event);
  }

  toggleExpandRow(row: any) {
    this.tables?.rowDetail.toggleExpandRow(row);
  }

}
