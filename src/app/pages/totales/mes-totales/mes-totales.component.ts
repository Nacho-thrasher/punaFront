import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';
import { SweetAlert2Helper } from 'src/app/helpers/sweet-alert-2.helper';
import { Usuario } from 'src/models/usuarios/usuario.model';
import { RegistroDiarioService } from './../../../services/registro-diario.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

declare var $: any;
// declare var jsPDF: any;
@Component({
  selector: 'app-mes-totales',
  templateUrl: './mes-totales.component.html',
  styleUrls: ['./mes-totales.component.css']
})
export class MesTotalesComponent implements OnInit {

  public idDonwloadPdf: boolean = false;
  public fechaHoy: any = new Date().toLocaleDateString('es-AR');
  public horaActual: any = new Date().toLocaleTimeString('es-AR');
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
    this.idDonwloadPdf = true;
    //htmlTable
    const data = document.getElementById('htmlTable')!;
    const doc = new jsPDF('p', 'pt', 'a4');
    const options = {
      background: 'white',
      scale: 4,
    };
    // agregar imagen de cabecera
    var img = new Image();
    img.src = 'https://res.cloudinary.com/hysmatafuegos/image/upload/v1663884304/caratula_iiijz8.png';
    img.onload = function () {
      // cargar imagen de cabecera logo
      // doc.addImage(img, 'PNG', 0, 0, 500, 100);
      doc.addImage(img, 50, 10, 500, 80)
      // cargar tabla

      html2canvas(data, options).then((canvas) => {
        // bajar la tabla 100px
        // const imgData = canvas.toDataURL('image/png');
        // const imgWidth = 500;
        // const pageHeight = 800;
        // const imgHeight = (canvas.height * imgWidth) / canvas.width;
        // let heightLeft = imgHeight;
        // let position = 0;
        // doc.addImage(imgData, 'PNG', 0, 100, imgWidth, imgHeight);
        // heightLeft -= pageHeight;
        // while (heightLeft >= 0) {
        //   position = heightLeft - imgHeight;
        //   doc.addPage();
        //   doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        //   heightLeft -= pageHeight;
        // }
        // doc.save('tableToPdf.pdf');
        // escribir arriba de la tabla fecha y hora
        const fechaHoy: any = new Date().toLocaleDateString('es-AR');
        const horaActual: any = new Date().toLocaleTimeString('es-AR');
        doc.addFont('ArialMS', 'Arial', 'normal');
        doc.setFont('Arial');
        doc.setFontSize(10);
        doc.text(`Planeta Puna - Posco - ${fechaHoy} - ${horaActual}`,15,110);

        const img = canvas.toDataURL('image/PNG');
        const bufferX = 15;
        // bajar la tabla 100px
        const bufferY = 120;
        const imgProps = (doc as any).getImageProperties(img);
        const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        doc.addImage(img, 'PNG', bufferX, bufferY, pdfWidth, pdfHeight, undefined, 'FAST');
        doc.save('table.pdf');
      })

    };

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
