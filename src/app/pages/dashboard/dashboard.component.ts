import { Component, OnInit } from '@angular/core';
import { Result } from '@zxing/library';

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

  constructor() { }

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

}
