import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Empresa } from 'src/models/empresas/empresa.model';
import { EmpresaService } from 'src/app/services/empresa.service';
import { RegistroDiarioService } from './../../services/registro-diario.service';
import { RegistroService } from 'src/models/registros/registroServicio.model';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';

declare const $: any;
declare const jQuery: any;

@Component({
  selector: 'app-promedi-diario-by-empresa',
  templateUrl: './promedi-diario-by-empresa.component.html',
  styleUrls: ['./promedi-diario-by-empresa.component.css']
})
export class PromediDiarioByEmpresaComponent implements OnInit {

  // public empresa: Empresa;
  public empresaName: string = '';
  public registrosDiarios: RegistroService[] = [];
  public registroDiariosJuntos: any[] = [];
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
  constructor(
    private empresaService: EmpresaService,
    private router: Router,
    private activatedRouter: ActivatedRoute,
    private registroDiarioService: RegistroDiarioService
  ) {

  }

  ngOnInit(): void {
    this.activatedRouter.params.subscribe(params => {
      console.log('params: ',params['id']);

      // this.cargarEmpresa(params['id']);
      this.registroDiarioService.cargarRegistrosDiariosByCompany(params['id'])
      .subscribe({
        next: (registrosDiarios) => {
          this.registrosDiarios = registrosDiarios;
          this.empresaName = registrosDiarios[0].usuario!.empresa!.name;
          console.log('registrosDiarios: ',this.registrosDiarios);

          //*********************/
          //? juntar con reduce los registros que tengan la misma date
          //*********************/
          this.registroDiariosJuntos = this.registrosDiarios.reduce((acc : any, curr) => {
            const existe = acc.find((x: { date: string; }) => x.date === curr.date);
            if (!existe) {
              console.log('curr.breakfast: ',existe);
              acc.push({
                date: curr.date,
                registros: [curr]
              });
            } else {
              // si breakfast es true, agregarlo al array
              existe.registros.push(curr);
            }
            return acc;
          }
          , []);

          // mapear los registros diarios juntos
          this.registroDiariosJuntos = this.registroDiariosJuntos.map((registroDiario) => {
            let breakfast = 0;
            let lunch = 0;
            let dinner = 0;
            let afternoonSnack = 0;
            let total = 0;
            if (registroDiario.registros.length > 0) {
              registroDiario.registros.forEach((registro: { breakfast: any; lunch: any; dinner: any; afternoonSnack: any; total: any; }) => {
                // sumar en 1 si contiene datos
                console.log('registro.breakfast: ',registro.breakfast);
                if (Object.keys(registro.breakfast).length > 0) {
                  breakfast++;
                }
                if (Object.keys(registro.lunch).length > 0) {
                  lunch++;
                }
                if (Object.keys(registro.dinner).length > 0) {
                  dinner++;
                }
                if (Object.keys(registro.afternoonSnack).length > 0) {
                  afternoonSnack++;
                }
                // sumar total y dividir por el numero de comidas
                total = breakfast + lunch + dinner + afternoonSnack;
                total = total / 4;
              });
            }

              return {
                date: registroDiario.date,
                breakfast: breakfast,
                lunch: lunch,
                dinner: dinner,
                afternoonSnack: afternoonSnack,
                total: total
              };
            });




          console.log('registroDiariosJuntos: ',this.registroDiariosJuntos);


          // this.registroDiariosJuntos = registrosDiariosJuntos;
          // console.log('registrosDiariosJuntos: ',registrosDiariosJuntos);
          //*********************/
          setTimeout(() => {
            this.temp = [...this.registroDiariosJuntos];
            this.rows = this.registroDiariosJuntos;
            this.filteredData = [...this.registroDiariosJuntos];
            this.columnsWithSearch = Object.keys(this.rows[0]);
            this.loadingIndicator = false;
          }, 500);
        },
        error: (err) => {
          console.log('err: ',err);
        },
        complete: () => {
          console.log('complete');
        }

      })
    }
    );

  }

}
