import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable()
export class SweetAlert2Helper {
  private options: SweetAlert2Options;

  constructor() {
    this.options = new SweetAlert2Options();
  }

  public info(
    title: string,
    description: string,
    callback: any,
    waitConfirmation?: boolean
  ) {
    if (waitConfirmation) {
      Swal.fire({
        icon: 'info',
        title: title,
        html: description,
        showConfirmButton: true,
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#00FCEF',
      }).then((result) => {
        if (result.value) {
          if (callback) {
            callback();
          }
        }
      });
    } else {
      Swal.fire({
        icon: 'info',
        title: title,
        html: description,
        timer: this.options.timer.short,
        showConfirmButton: false,
      }).then(() => {
        if (callback) {
          callback();
        }
      });
    }
  }

  public success(
    title: string,
    description: string,
    callback: any,
    waitConfirmation?: boolean
  ) {
    if (waitConfirmation) {
      Swal.fire({
        icon: 'success',
        title: title,
        html: description,
        showConfirmButton: true,
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#00FCEF',
      }).then((result) => {
        if (result.value) {
          if (callback) {
            callback();
          }
        }
      });
    } else {
      Swal.fire({
        icon: 'success',
        title: title,
        html: description,
        timer: this.options.timer.short,
        showConfirmButton: false,
      }).then(() => {
        if (callback) {
          callback();
        }
      });
    }
  }

  public error(
    title: string,
    description: string,
    callback: any,
    waitConfirmation?: boolean
  ) {
    if (waitConfirmation) {
      Swal.fire({
        icon: 'error',
        title: title,
        html: description,
        showConfirmButton: true,
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#00FCEF',
      }).then((result) => {
        if (result.value) {
          if (callback) {
            callback();
          }
        }
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: title,
        html: description,
        timer: this.options.timer.short,
        showConfirmButton: false,
      }).then(() => {
        if (callback) {
          callback();
        }
      });
    }
  }

  public warning(
    title: string,
    description: string,
    callback: any,
    waitConfirmation?: boolean
  ) {
    if (waitConfirmation) {
      Swal.fire({
        icon: 'warning',
        title: title,
        html: description,
        showConfirmButton: true,
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#00FCEF',
      }).then((result) => {
        if (result.value) {
          if (callback) {
            callback();
          }
        }
      });
    } else {
      Swal.fire({
        icon: 'warning',
        title: title,
        html: description,
        timer: this.options.timer.short,
        showConfirmButton: false,
      }).then(() => {
        if (callback) {
          callback();
        }
      });
    }
  }

  public question(
    title: string,
    description: string,
    confirmButtonText: string,
    cancelButtonText: string,
    confirmCallback: any,
    cancelCallback?: any
  ) {
    Swal.fire({
      icon: 'question',
      title: title,
      html: description,
      confirmButtonText: confirmButtonText,
      cancelButtonText: cancelButtonText,
      confirmButtonColor: '#00FCEF',
      cancelButtonColor: '#F44336',
      showCancelButton: true,
    }).then((result) => {
      if (result.value) {
        if (confirmCallback) {
          confirmCallback();
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        if (cancelCallback) {
          cancelCallback();
        }
      }
    });
  }
  // signed in sweet alert 2
  public signedIn() {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })
    Toast.fire({
      icon: 'success',
      title: 'Inicio de sesión exitoso'
    })

  }

  public showLoading() {
    Swal.fire({
      title: 'Cargando...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
  }

  public hideLoading() {
    Swal.close();
  }

}




class SweetAlert2Options {
  timer: Timer;
  confirmButtonColor: string;
  cancelButtonColor: string;

  constructor() {
    this.timer = {
      short: 3000,
      long: 5000,
    };
    this.confirmButtonColor = '#039BE5';
    this.cancelButtonColor = '#F44336';
  }
}

class Timer {
  short: number;
  long: number;

  constructor() {
    this.short = 3000;
    this.long = 5000;
  }
}

