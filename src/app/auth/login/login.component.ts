import { Component, OnInit, NgZone } from '@angular/core';
import { AbstractControlOptions, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuario } from 'src/models/usuarios/usuario.model';
import { SweetAlert2Helper } from './../../helpers/sweet-alert-2.helper';

declare var $: any;
declare var Jquery: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public formSubmitted = false;
  public roleUser: any;
  constructor(
    private router:Router,
    private fb:FormBuilder,
    private usuarioService: UsuarioService,
    private ngZone: NgZone,
    private sweetAlert2Helper: SweetAlert2Helper
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
        this.roleUser = data.user.user_type.name;
        this.sweetAlert2Helper.signedIn()
      },
      error: (err) => {
        this.formSubmitted = false;
        console.log(err);
        this.sweetAlert2Helper.error(
          'Error',
          'Usuario o contraseña incorrectos',
          ()=> {},
          true
        )
      },
      complete: () => {
        // this.ngZone.run(() => {
        //   this.router.navigate(['/']);
        // });
        if (this.roleUser == 'autoservicio comensal') {
          console.log('redirigir comensal');
          this.ngZone.run(() => this.router.navigateByUrl('/dashboard/registrar-comensales'));
        } else {
          //* refresh page
          this.ngZone.run(() => this.router.navigateByUrl('/dashboard'));

        }
      }
    })

  }

}
