import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';
import { SweetAlert2Helper } from 'src/app/helpers/sweet-alert-2.helper';
import { Usuario } from 'src/models/usuarios/usuario.model';
import { RegistroDiarioService } from './../../../services/registro-diario.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-mes-totales',
  templateUrl: './mes-totales.component.html',
  styleUrls: ['./mes-totales.component.css']
})
export class MesTotalesComponent implements OnInit {

  roleUser: string = this.usuarioService.role;
  // obtener parametro de la url
  public mes: string | null = '';
  public TotalesDias: any[] = [];
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
    private usuarioService: UsuarioService,
    private registroDiarioService: RegistroDiarioService,
    private SweetAlert2Helper: SweetAlert2Helper,
  ) { }

  ngOnInit(): void {
    this.mes = this.route.snapshot.paramMap.get('mes');
    console.log('mes-totales.component.ts', this.mes);
    this.cargarTotalesDias()
    // this.downloadPDF();
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

  cargarTotalesDias() {
    this.registroDiarioService.cargarTotalesPorMes(this.mes)
    .subscribe({
      next: (resp: any) => {
        this.TotalesDias = resp;
        if(this.TotalesDias.length == 0) {
          this.SweetAlert2Helper.warning(
            'No hay registros',
            'No hay registros para este mes',
            () => {
              this.router.navigate(['/dashboard/totales']);
            },
            false
          )
        }
        else {
          console.log('mes-totales.component.ts', this.TotalesDias);
          setTimeout(() => {
            this.temp = [...this.TotalesDias];
            this.rows = this.TotalesDias;
            this.filteredData = [...this.TotalesDias];
            this.columnsWithSearch = Object.keys(this.TotalesDias[0]);
            this.loadingIndicator = false;
          }, 500);
        }
      },
      error: (err: any) => {
        console.log(err);
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
