import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';

// Este es nuestro controlador de la vista login
@Component({
  selector: 'app-login',
  templateUrl: '../../views/login/login.page.html', // Actualiza la ruta según la nueva ubicación
  styleUrls: ['../../views/login/login.page.scss'],
})
export class LoginPage {
  usuario: string | undefined;
  contrasena: string | undefined;
  usuarioError: boolean = false;
  contrasenaError: boolean = false;
  showPassword: boolean = false; // Variable para controlar la visibilidad de la contraseña

  constructor(private router: Router, private usuarioService: UsuarioService) { }

  ngOnInit() {
    // Limpiar los campos de entrada cuando la página se carga
    this.usuario = '';
    this.contrasena = '';
  }
  
  validateForm() {
    this.usuarioError = !this.usuario;
    this.contrasenaError = !this.contrasena;
  }
//Valida que las credenciales sean correctas
  login() {
    this.validateForm();
    if (!this.usuarioError && !this.contrasenaError && this.usuario && this.contrasena) {
      const hashContrasenia = this.usuarioService.hashContrasenia(this.contrasena);
      console.log('Hashed Contraseña:', hashContrasenia); // El dato que ingresa el usuario se convierte en un hash

      // Verificar el hash de la contraseña
      const isValid = this.usuarioService.verificarUsuario(this.usuario, this.contrasena);
      if (isValid) {
        console.log('Hash verificado correctamente');
        this.router.navigate(['/vehicles']);
      } else {
        alert('Las credenciales son incorrectas');
      }
    } else {
      this.validateForm();
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword; // Alternar la visibilidad de la contraseña
  }
}