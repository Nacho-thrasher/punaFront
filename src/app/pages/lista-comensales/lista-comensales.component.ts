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
        console.log('registros aqui',this.Registros);
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

  createdBySearch(event: any) {
    let filter = event.target.value.toLowerCase();
    this.rows = this.filteredData.filter((item:any) => {
      console.log('item',item.createdBy);
      // buscar coincidencias dentro de objeto createdBy
      if (item.createdBy.userName.toLowerCase().indexOf(filter) !== -1) {
        return true;
      } else if (item.createdBy.document.toLowerCase().indexOf(filter) !== -1) {
        return true;
      }
      return;
    });
    this.table.offset = 0;
    console.log('rows',this.rows);
  }

  updateFilter(event: any) {
    // get the value of the key pressed and make it lowercase
    let filter = event.target.value.toLowerCase();
    // assign filtered matches to the active datatable
    this.rows = this.filteredData.filter((item:any) => {
      // iterate through each row's column data
      for (let i = 0; i < this.columnsWithSearch.length; i++){
        var colValue = item[this.columnsWithSearch[i]];
        console.log('colValue',colValue);
        // if no filter OR colvalue is NOT null AND contains the given filter
        if(!filter || (!!colValue && colValue.toString().toLowerCase().indexOf(filter) !== -1)) {
          // found match, return true to add to result set
          return true;
        }
      }
      return;
    });
    console.log('rows',this.rows);
    // TODO - whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }

  toggleExpandRow(row: any) {
    this.tables?.rowDetail.toggleExpandRow(row);
  }

}
