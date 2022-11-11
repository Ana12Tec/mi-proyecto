import { Component, OnInit } from '@angular/core';
import { switchMap } from 'rxjs';
import Swal from 'sweetalert2';
import { AuthService } from './services/auth.service';
import { TokenService } from './services/token.service';
import { UsersService } from './services/users.service';
import { FilesService } from './services/file.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = '';
  imgParent = '';
  widthImg = 10;
  name = 'Ana';
  age = 36;
  img = 'https://www.w3schools.com/howto/img_avatar.png';
  btndisabled = true;
  showImg = true;
  register = {
    name: '',
    email: '',
    pass: ''
  };
  token = '';
  imgRta = '';

  constructor(
    private usersService: UsersService,
    private filesService: FilesService,
    private authService : AuthService,
    private tokenService : TokenService
  ) { }

  ngOnInit(){
    const token = this.tokenService.getToken();
    if(token){
      this.authService.getProfile()
      .subscribe()
    }
  }

  person = {
    name: 'Ana',
    age: 36,
    avatar: 'https://www.w3schools.com/howto/img_avatar.png'
  }

  names: string[] = [
    'Ana',
    'Esthefany',
    'Pamela'
  ];

  newNames = '';

  box = {
    width: 100,
    heigth: 100,
    background: 'red'
  };

  ActivaBoton() {
    this.btndisabled = !this.btndisabled;
  }

  AumentaEdad() {
    this.person.age += 1;
  }

  onScroll(event: Event) {
    const elemento = event.target as HTMLElement;
    console.log(elemento.scrollTop);
  }

  changeName(event: Event) {
    const elemento = event.target as HTMLInputElement;
    this.person.name = elemento.value
  }

  AddName() {
    this.names.push(this.newNames);
    this.newNames = '';
  }

  DeleteName(index: number) {
    this.names.splice(index, 1);
  }

  onRegister() {
    console.log(this.register);
  }

  onLoaded(img: string) {
    console.log('loaded padre', img);
  }

  toggleImg() {
    this.showImg = !this.showImg;
  }

  createUser() {
    this.usersService.create({
      name: 'Sebas',
      email: 'sebas@mail.com',
      password: '1212',
      role: 'customer'
    })
      .subscribe(rta => {
        console.log(rta);
      });
  }

  downloadPdf() {
    this.filesService.getFile('my.pdf', 'https://young-sands-07814.herokuapp.com/api/files/dummy.pdf', 'application/pdf')
    .subscribe()
  }

  onUpload(event: Event) {
    const element = event.target as HTMLInputElement;
    const file = element.files?.item(0);
    if (file) {
      this.filesService.uploadFile(file)
      .subscribe(rta => {
        this.imgRta = rta.location;
      });
    }
  }
}
