import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { UsuarioService } from 'src/app/services/usuario.service';
import { SweetAlert2Helper } from 'src/app/helpers/sweet-alert-2.helper';
import { Usuario } from 'src/models/usuarios/usuario.model';
import { ActivatedRoute, Router } from '@angular/router';
import { RegistroDiarioService } from 'src/app/services/registro-diario.service';
import { Empresa } from 'src/models/empresas/empresa.model';
import { EmpresaService } from './../../../services/empresa.service';

declare const $: any;
declare const jQuery: any;

@Component({
  selector: 'app-empresas-totales',
  templateUrl: './empresas-totales.component.html',
  styleUrls: ['./empresas-totales.component.css']
})
export class EmpresasTotalesComponent implements OnInit {

  public Empresas: Empresa[] = [];
  public RegistrosByDate: any[] = [];
  public mes: string | null = '';
  public dia: string | null = '';
  public roleUser: string = this.usuarioService.role;
  public usuario: Usuario = this.usuarioService.usuario;
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
    private router: Router,
    private route: ActivatedRoute,
    private empresaService: EmpresaService,
    private registroDiarioService: RegistroDiarioService,
    private usuarioService: UsuarioService,
    private sweetAlert2Helper: SweetAlert2Helper
  ) { }

  ngOnInit(): void {
    this.mes = this.route.snapshot.paramMap.get('mes');
    this.dia = this.route.snapshot.paramMap.get('dia');
    console.log(this.dia, this.mes);
    this.cargarRegistrosByDate();
  }

  cargarEmpresas() {
    this.empresaService.cargarEmpresas()
    .subscribe({
      next: (resp: any) => {
        this.Empresas = resp;
        setTimeout(() => {
          this.temp = [...this.Empresas];
          this.rows = this.Empresas;
          this.filteredData = [...this.Empresas];
          this.columnsWithSearch = Object.keys(this.Empresas[0]);
          this.loadingIndicator = false;
        }, 500);
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  cargarRegistrosByDate() {
    this.registroDiarioService.cargarRegistrosPorFechaCompleta(this.mes, this.dia)
    .subscribe({
      next: (resp: any) => {
        this.RegistrosByDate = resp;
        console.log(this.RegistrosByDate);
        setTimeout(() => {
          this.temp = [...this.RegistrosByDate];
          this.rows = this.RegistrosByDate;
          this.filteredData = [...this.RegistrosByDate];
          this.columnsWithSearch = Object.keys(this.RegistrosByDate[0]);
          this.loadingIndicator = false;
        }, 500);
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  visarRegistro(registro: any) {
    console.log('visado: ',registro);
    const meses = [
      { mes: '01', nombre: 'enero' },
      { mes: '02', nombre: 'febrero' },
      { mes: '03', nombre: 'marzo' },
      { mes: '04', nombre: 'abril' },
      { mes: '05', nombre: 'mayo' },
      { mes: '06', nombre: 'junio' },
      { mes: '07', nombre: 'julio' },
      { mes: '08', nombre: 'agosto' },
      { mes: '09', nombre: 'septiembre' },
      { mes: '10', nombre: 'octubre' },
      { mes: '11', nombre: 'noviembre' },
      { mes: '12', nombre: 'diciembre' },
    ]
    const args = {
      empresa: registro.uid,
      usuario: this.usuario.uid,
      fechaRegistro: `${this.dia}/${meses.find(m => m.nombre === this.mes)?.mes}/${new Date().getFullYear()}`,
      registroDiarioId: registro.registroId
    }

    this.registroDiarioService.crearVisado(args)
    .subscribe({
      next: (resp: any) => {
        this.sweetAlert2Helper.success(
          'Registro visado correctamente',
          'El registro se ha visado correctamente',
          ()=>{},
          false
        );

        this.cargarRegistrosByDate();
      }
    });

  }

}
