import { Component, OnInit } from '@angular/core';
import { EmpresaService } from 'src/app/services/empresa.service';
import { Empresa } from 'src/models/empresas/empresa.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-promedios-diarios',
  templateUrl: './promedios-diarios.component.html',
  styleUrls: ['./promedios-diarios.component.css']
})
export class PromediosDiariosComponent implements OnInit {

  public empresas: Empresa[] = [];
  //? preload data
  public isLoad: boolean = true;

  constructor(
    private empresaService: EmpresaService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.cargarEmpresas();
  }

  cargarEmpresas(){
    this.isLoad = true;
    this.empresaService.cargarEmpresas()
    .subscribe((empresa) => {
      this.empresas = empresa;
      this.isLoad = false;
      console.log('empresas: ',this.empresas);
    })
  }

  selectEmpresa(empresa: Empresa){
    console.log('empresa: ',empresa);
    // navigate to promedios-diarios/:id
    this.router.navigate(['/promedios-diarios', empresa.uid]);
  }

}
