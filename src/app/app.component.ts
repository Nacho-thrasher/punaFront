import { Component, OnInit } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { HttpClient } from '@angular/common/http';

declare var $: any;
declare var Jquery: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Planeta Puna';

  constructor(private ngxLoader: NgxUiLoaderService){
    this.ngxLoader.start();
    this.ngxLoader.stop();
  }

  ngOnInit(): void {
    this.ngxLoader.start();
    // this.http.get(`https://api.npmjs.org/downloads/range/last-year/ngx-ui-loader`).subscribe((res: any) => {
    //   console.log(res);
    // });
    this.ngxLoader.stop();
  }

}
