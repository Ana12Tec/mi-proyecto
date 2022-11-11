import { Component, OnInit } from '@angular/core';
import { OnExit } from './../../../guards/exit.guard';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.sass']
})
export class RegisterComponent implements OnExit {

  constructor() { }

  OnExit(){
    this.onExit();
  }

  onExit () {
    const confirm = Swal.fire({
      title: '¿Estas seguro que quieres salir?',
      showDenyButton: true,
      confirmButtonText: 'Yes',
    }).then((result) => {
      if (result.isConfirmed) {
        return true;
      }
      return false
    });
    return confirm
  };
}
