import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
// modulos
import { AppRoutingModule } from './app-routing.module';
import { PagesModule } from './pages/pages.module';
import { AuthModule } from './auth/auth.module';
// componentes
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgxUiLoaderModule,
  NgxUiLoaderConfig,
  SPINNER,
  POSITION,
  PB_DIRECTION,
  NgxUiLoaderRouterModule,
  NgxUiLoaderHttpModule } from 'ngx-ui-loader';


  const ngxUiLoaderConfig: NgxUiLoaderConfig = {
    "bgsColor": "red",
    "bgsOpacity": 0.5,
    "bgsPosition": "bottom-right",
    "bgsSize": 60,
    "bgsType": "ball-spin-clockwise",
    "blur": 5,
    "delay": 0,
    "fastFadeOut": true,
    "fgsColor": "#00afef",
    "fgsPosition": "center-center",
    "fgsSize": 60,
    "fgsType": "ball-spin-clockwise",
    "gap": 24,
    "logoPosition": "center-center",
    "logoSize": 120,
    "logoUrl": 'https://res.cloudinary.com/hysmatafuegos/image/upload/v1659745309/logo-3_d1giyk.png',
    "masterLoaderId": "master",
    "overlayBorderRadius": "0",
    "overlayColor": "rgba(40, 40, 40, 0.8)",
    "pbColor": "#acce61",
    "pbDirection": "ltr",
    "pbThickness": 3,
    "hasProgressBar": true,
    "text": "cargando...",
    "textColor": "#00afef",
    "textPosition": "center-center",
    "maxTime": -1,
    "minTime": 300
  };
@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    PagesModule,
    AuthModule,
    NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
    NgxUiLoaderRouterModule, // import this module for showing loader automatically when navigating between app routes
    NgxUiLoaderHttpModule,
    HttpClientModule,
    NgxDatatableModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
