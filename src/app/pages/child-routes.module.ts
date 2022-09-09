// * RUTAS HIJAS * //
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
//? guard
import { AdminGuard } from '../guard/admin.guard';
//? componentes
import { DashboardComponent } from './dashboard/dashboard.component';
import { PerfilComponent } from './perfil/perfil.component';
import { EmpresasComponent } from './empresas/empresas.component';
import { ComensalesComponent } from './comensales/comensales.component';
import { RegistrarComensalesComponent } from './registrar-comensales/registrar-comensales.component';
import { MenuDiarioComponent } from './menu-diario/menu-diario.component';
import { PromediosDiariosComponent } from './promedios-diarios/promedios-diarios.component';
import { PromediDiarioByEmpresaComponent } from './promedi-diario-by-empresa/promedi-diario-by-empresa.component';
import { AdministrarUsuariosComponent } from './perfil/administrar-usuarios/administrar-usuarios.component';
import { ConfiguracionesComponent } from './perfil/configuraciones/configuraciones.component';
import { ListaComensalesComponent } from './lista-comensales/lista-comensales.component';
import { TotalesComponent } from './totales/totales.component';
import { MesTotalesComponent } from './totales/mes-totales/mes-totales.component';
import { EmpresasTotalesComponent } from './totales/empresas-totales/empresas-totales.component';
import { DiasTotalesComponent } from './totales/dias-totales/dias-totales.component';
import { ExtrasComponent } from './extras/extras.component';

const ChildRoutes: Routes = [
  { path: '', component: DashboardComponent, data: {titulo: 'Inicio'} },
  { path: 'perfil', component: PerfilComponent, data: {titulo: 'Perfil', content: 'perfil'} },
  { path: 'empresas', component: EmpresasComponent, data: {titulo: 'Empresas', content: 'empresas'} },
  { path: 'comensales', component: ComensalesComponent, data: {titulo: 'Comensales', content: 'comensales'} },
  { path: 'registrar-comensales', component: RegistrarComensalesComponent, data: {titulo: 'Registrar Comensales', content: 'registrar-comensales'} },
  { path: 'menu-diario', component: MenuDiarioComponent, data: {titulo: 'Menu Diario', content: 'menu-diario'} },
  { path: 'promedios-diarios', component: PromediosDiariosComponent, data: {titulo: 'Promedios Diarios', content: 'promedios-diarios'} },
  { path: 'promedios-diarios/:id', component: PromediDiarioByEmpresaComponent, data: {titulo: 'Promedios Diarios', content: 'promedios-diarios'} },
  { path: 'administrar-usuarios', canActivate: [AdminGuard], component: AdministrarUsuariosComponent, data: {titulo: 'Administrar Usuarios', content: 'administrar-usuarios'} },
  { path: 'configuraciones', canActivate: [AdminGuard], component: ConfiguracionesComponent, data: {titulo: 'Configuraciones', content: 'configuraciones'} },
  { path: 'lista-comensales', component: ListaComensalesComponent, data: {titulo: 'Lista Comensales', content: 'lista-comensales'} },
  { path: 'totales', component: TotalesComponent, data: {titulo: 'Totales', content: 'totales'} },
  { path: 'totales/:mes', component: MesTotalesComponent, data: {titulo: 'Mes Totales', content: 'mes-totales'} },
  { path: 'totales/:mes/:dia', component: EmpresasTotalesComponent, data: {titulo: 'Empresas Totales', content: 'empresas-totales'} },
  { path: 'totales/:mes/:dia/:empresa', component: DiasTotalesComponent, data: {titulo: 'Dias Totales', content: 'dias-totales'} },
  { path: 'extras', component: ExtrasComponent, data: {titulo: 'Extras', content: 'extras'} },
]

@NgModule({
  declarations: [],
  imports: [
  CommonModule,
    RouterModule.forChild(ChildRoutes)
  ],
  exports: [RouterModule]
})
export class ChildRoutesModule { }
