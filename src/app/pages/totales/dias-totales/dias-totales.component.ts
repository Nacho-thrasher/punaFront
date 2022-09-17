import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { SweetAlert2Helper } from 'src/app/helpers/sweet-alert-2.helper';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuario } from 'src/models/usuarios/usuario.model';
import { ActivatedRoute, Router } from '@angular/router';
import { RegistroDiarioService } from 'src/app/services/registro-diario.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-dias-totales',
  templateUrl: './dias-totales.component.html',
  styleUrls: ['./dias-totales.component.css']
})
export class DiasTotalesComponent implements OnInit {

  public RegistrosEmpresa: any[] = [];
  // public NuevoArrayRegistros: any[] = [];
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
        console.log(this.RegistrosEmpresa);
        // mapear y si es un objeto agregar 1  y si no 0
        this.RegistrosEmpresa.forEach((element: any) => {
          if (Object.keys(element.breakfast).length > 0) {
            element.breakfast = 1;
          } else {
            element.breakfast = 0;
          }
          if (Object.keys(element.lunch).length > 0) {
            element.lunch = 1;
          }
          else {
            element.lunch = 0;
          }
          if (Object.keys(element.dinner).length > 0) {
            element.dinner = 1;
          }
          else {
            element.dinner = 0;
          }
          if (Object.keys(element.afternoonSnack).length > 0) {
            element.afternoonSnack = 1;
          }
          else {
            element.afternoonSnack = 0;
          }
        });

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

  downloadPDF() {
    console.log('descargar pdf');
    // tomar this.totalDias json y convertirlo a pdf
    //htmlTable
    const data = document.getElementById('htmlTable')!;
    const doc = new jsPDF('p', 'pt', 'a4');
    const options = {
      background: 'white',
      scale: 3
    };
    html2canvas(data, options).then((canvas) => {
      const img = canvas.toDataURL('image/PNG');
      const bufferX = 15;
      const bufferY = 15;
      const imgProps = (doc as any).getImageProperties(img);
      const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      doc.addImage(img, 'PNG', bufferX, bufferY, pdfWidth, pdfHeight, undefined, 'FAST');
      doc.save('table.pdf');
    })

  }


}
