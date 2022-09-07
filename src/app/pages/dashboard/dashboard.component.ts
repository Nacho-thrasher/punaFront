import { Component, OnInit } from '@angular/core';
import { Result } from '@zxing/library';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';

declare var $: any;
declare var Jquery: any;
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  title = 'qr-reader';
  public cameras:MediaDeviceInfo[]=[];
  public myDevice!: MediaDeviceInfo;
  public scannerEnabled=false;
  public results:string[]=[];
  public roleUser: string = this.usuarioService.role

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private usuarioService: UsuarioService
  ) { }

  ngOnInit(): void {
  }

  openCamera() {
    console.log('openCamera');
  }

  camerasFoundHandler(cameras: MediaDeviceInfo[]){
    this.cameras=cameras;
    this.selectCamera(this.cameras[0].label);
  }

  scanSuccessHandler(event:string){
    console.log('scaner result : ',event);
    this.results.unshift(event);
  }

  scanErrorHandler(event:any){
    console.log('scaner error : ',event);
  }

  selectCamera(cameraLabel: string){
    this.cameras.forEach(camera=>{
      if(camera.label.includes(cameraLabel)){
        this.myDevice=camera;
        console.log('scaner camera ',camera.label);
        this.scannerEnabled=true;
      }
    })
  }

  openDropdown(item: string) {
    console.log('openDropdown',item);
    // desplegar dropdown de opciones

  }

  redirigir(ruta: string, modalName: string) {
    // cerrar modal
    $(`#${modalName}`).modal('hide');
    // redirigir a ruta
    this.router.navigate([ruta], { relativeTo: this.activatedRoute });
  }

}
