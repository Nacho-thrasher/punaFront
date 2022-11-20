import { Component, OnInit, ViewChild } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuario } from 'src/models/usuarios/usuario.model';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { SweetAlert2Helper } from 'src/app/helpers/sweet-alert-2.helper';
import { AbstractControlOptions, FormBuilder, FormControl, FormGroup, Validators, ValidationErrors, ValidatorFn, NgForm  } from '@angular/forms';

declare var $: any;
declare var jQuery: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  public Notificaciones: any[] = [];
  public usuario?: Usuario;
  public isActive: boolean = false;
  public roleUser: string = this.usuarioService.role;
  @ViewChild('myNgForm') myNgForm!: NgForm;
  public formSubmitted = false;
  public formGroup: FormGroup;
  public idSelected: string | null = null;

  public isComensal: boolean = false;

  constructor(
    private usuarioService: UsuarioService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private sweetAlert2Helper: SweetAlert2Helper,
    private fb: FormBuilder,
  ) {
    this.formGroup = this.createFormGroup();
  }

  ngOnInit(): void {
    this.isComensal = this.roleUser == 'autoservicio comensal';
    this.usuario = this.usuarioService.usuario;
    this.Notificaciones = JSON.parse(localStorage.getItem('notifications')!) || [];
    this.Notificaciones.sort((a: any, b: any) => {
      return new Date((b.date).split('/').reverse().join('-')).getTime() - new Date((a.date).split('/').reverse().join('-')).getTime();
    });
    console.log("notificaciones => ",this.Notificaciones);
  }

  logout(){
    this.usuarioService.logout();
  }

  cambiarPassword(){
    if (this.formGroup.invalid) {
      this.formSubmitted = true;
      return;
    }
    // alert
    const userId = this.usuarioService.uid;
    this.sweetAlert2Helper.question(
      '¿Está seguro de cambiar la contraseña?',
      'La contraseña se cambiará por la nueva contraseña',
      'Si, cambiar contraseña',
      'No, cancelar',
      () => {
        console.log('cambiar contraseña', this.formGroup.value.password);
        this.usuarioService.cambiarPassword(this.formGroup.value.password, userId)
        .subscribe({
          next: (resp) => {
            this.sweetAlert2Helper.success(
              'Contraseña cambiada',
              'La contraseña se ha cambiado correctamente',
              () => {
                // this.logout();
                this.formGroup.reset();
                this.formSubmitted = false;
                $('#cambiarPassword').modal('hide');
              },
              false
            );
            this.formGroup.reset();
            this.formSubmitted = false;
          },
          error: (err) => {
            this.sweetAlert2Helper.error(
              'Error',
              'No se ha podido cambiar la contraseña',
              () => { },
              false
            );
          }
        })
      },
      ()=> {}
    )

  }

  createFormGroup(): FormGroup {
    const formGroup = this.fb.group({
      password: ['', Validators.required],
    })
    this.onFormGroupChanges(formGroup);
    return formGroup;
  }

  onFormGroupChanges(formGroup: FormGroup) {}

}
