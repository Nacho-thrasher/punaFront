import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { SweetAlert2Helper } from 'src/app/helpers/sweet-alert-2.helper';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuario } from 'src/models/usuarios/usuario.model';
import { ActivatedRoute, Router } from '@angular/router';
import { RegistroDiarioService } from 'src/app/services/registro-diario.service';

@Component({
  selector: 'app-dias-totales',
  templateUrl: './dias-totales.component.html',
  styleUrls: ['./dias-totales.component.css']
})
export class DiasTotalesComponent implements OnInit {

  public RegistrosEmpresa: any[] = [];
  public mes: string | null = '';
  public dia: string | null = '';
  public empresa: string | null = '';
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
    private registroDiarioService: RegistroDiarioService,
    private route: ActivatedRoute,
    private router: Router,
    private sweetAlert2Helper: SweetAlert2Helper
  ) { }

  ngOnInit(): void {
    this.mes = this.route.snapshot.paramMap.get('mes');
    this.dia = this.route.snapshot.paramMap.get('dia');
    this.empresa = this.route.snapshot.paramMap.get('empresa');
    this.cargarRegistrosEmpresaByDate();
  }

  cargarRegistrosEmpresaByDate() {
    this.registroDiarioService.cargarRegistrosDiariosEmpresaPorFecha(this.mes, this.dia, this.empresa)
    .subscribe({
      next: (resp: any) => {
        this.RegistrosEmpresa = resp;
        if(this.RegistrosEmpresa.length == 0) {
          this.sweetAlert2Helper.warning(
            'No hay registros',
            'No hay registros para este dia en esta empresa',
            () => {
              this.router.navigate([`/dashboard/totales/${this.mes}`]);
            },
            false
          )
        } else {
          setTimeout(() => {
            this.temp = [...this.RegistrosEmpresa];
            this.rows = this.RegistrosEmpresa;
            this.filteredData = [...this.RegistrosEmpresa];
            this.columnsWithSearch = Object.keys(this.RegistrosEmpresa[0]);
            this.loadingIndicator = false;
          }, 500);
        }
      }
    })
  }

}
