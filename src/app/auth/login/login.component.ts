import { Component, OnInit, NgZone } from '@angular/core';
import { AbstractControlOptions, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuario } from 'src/models/usuarios/usuario.model';

declare var $: any;
declare var Jquery: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public formSubmitted = false;

  constructor(
    private router:Router,
    private fb:FormBuilder,
    private usuarioService: UsuarioService,
    private ngZone: NgZone
  ) { }

  public loginForm = this.fb.group({
    password: ['' , [Validators.required]],
    userName: [localStorage.getItem('userName') || '', [Validators.required, Validators.minLength(3)]],
    remember: [false]
  } as AbstractControlOptions);

  ngOnInit(): void {
  }

  login(){
    //@todo: swal de success sweetalert
    this.formSubmitted = true;
    this.usuarioService.looginUsuario(this.loginForm.value)
    .subscribe({
      next: (data) => {
        this.formSubmitted = false;
        this.ngZone.run(() => {
          this.router.navigate(['/']);
        });
      },
      error: (err) => {
        this.formSubmitted = false;
        console.log(err);
      },
      complete: () => {
        console.log('complete');
      }
    })

  }

}
