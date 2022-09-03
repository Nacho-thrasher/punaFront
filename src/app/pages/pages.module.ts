import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
//? pages
import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PerfilComponent } from './perfil/perfil.component';
//? modulos
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { AppRoutingModule } from '../app-routing.module';
import { EmpresasComponent } from './empresas/empresas.component';
import { ComensalesComponent } from './comensales/comensales.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
// no page found despues
import { ClickOutsideModule } from 'ng-click-outside';
import { RegistrarComensalesComponent } from './registrar-comensales/registrar-comensales.component';
import { MenuDiarioComponent } from './menu-diario/menu-diario.component';
import { PromediosDiariosComponent } from './promedios-diarios/promedios-diarios.component';
import { PromediDiarioByEmpresaComponent } from './promedi-diario-by-empresa/promedi-diario-by-empresa.component';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { AdministrarUsuariosComponent } from './perfil/administrar-usuarios/administrar-usuarios.component';
import { ConfiguracionesComponent } from './perfil/configuraciones/configuraciones.component';
import { ListaComensalesComponent } from './lista-comensales/lista-comensales.component';
import { TotalesComponent } from './totales/totales.component';
import { MesTotalesComponent } from './totales/mes-totales/mes-totales.component';
import { EmpresasTotalesComponent } from './totales/empresas-totales/empresas-totales.component';
import { DiasTotalesComponent } from './totales/dias-totales/dias-totales.component';

@NgModule({
  declarations: [
    PagesComponent,
    DashboardComponent,
    PerfilComponent,
    EmpresasComponent,
    ComensalesComponent,
    RegistrarComensalesComponent,
    MenuDiarioComponent,
    PromediosDiariosComponent,
    PromediDiarioByEmpresaComponent,
    AdministrarUsuariosComponent,
    ConfiguracionesComponent,
    ListaComensalesComponent,
    TotalesComponent,
    MesTotalesComponent,
    EmpresasTotalesComponent,
    DiasTotalesComponent,
  ],
  exports: [
    PagesComponent,
    DashboardComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    AppRoutingModule,
    NgxDatatableModule,
    ClickOutsideModule,
    ZXingScannerModule,
  ]
})
export class PagesModule { }
