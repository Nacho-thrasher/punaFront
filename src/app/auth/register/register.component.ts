import { Component, OnInit } from '@angular/core';
import { AbstractControlOptions, FormBuilder, FormControl, FormGroup, Validators, ValidationErrors, ValidatorFn  } from '@angular/forms';
import { UsuarioService } from 'src/app/services/usuario.service';
//? import swal de sweetalert2
import { Router } from '@angular/router';
declare var $: any;
declare var Jquery: any;

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  public formSubmitted = false;

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private router: Router
  )
  { }

  public registerForm = this.fb.group({
    userName: ['', [Validators.required, Validators.minLength(3)]],
    firstName: ['', [Validators.required, Validators.minLength(3)]],
    lastName: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    typeDocument: ['', [Validators.required]],
	  document: ['', [Validators.required, Validators.minLength(3)]],
    cuil: ['', [Validators.required, Validators.minLength(3)]],
  });

  ngOnInit(): void {
  }

  crearUsuario() {
    this.formSubmitted = true;
    if (this.registerForm.valid) {
      this.usuarioService.crearUsuario(this.registerForm.value)
      .subscribe({
        next: (data) => {
          console.log(data);
          this.router.navigate(['/']);
        },
        error: (err) => {
          console.log(err);
        },
        complete: () => {
          console.log('complete');
        }
      })
    }
    else{
      console.log('formulario invalido');
    }
  }

  campoNoValido(campo: string): boolean {
    if(this.registerForm.get(campo)?.invalid && this.formSubmitted){
      return true;
    }else{
      return false;
    }
  }



}
