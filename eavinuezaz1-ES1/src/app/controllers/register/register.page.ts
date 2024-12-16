import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/usuario.model';
import { Platform, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: '../../views/register/register.page.html',
  styleUrls: ['../../views/register/register.page.scss'],
})
export class RegisterPage {
  isAlertOpen = false;
  nombreCompleto: string | undefined;
  usuario: string | undefined;
  correo: string | undefined;
  contrasena: string | undefined;
  nombreCompletoError: string = '';
  usuarioError: string = '';
  correoError: string = '';
  contrasenaError: string = '';
  showPassword: boolean = false;
  backButtonSubscription: Subscription | undefined;
  mensajeExito: string | undefined;

  constructor(
    private router: Router,
    private usuarioService: UsuarioService,
    private toastController: ToastController,
    private platform: Platform
  ) { }

  ngOnInit() {
    this.nombreCompleto = '';
    this.usuario = '';
    this.correo = '';
    this.contrasena = '';

    this.backButtonSubscription = this.platform.backButton.subscribeWithPriority(10, () => {
      this.showConfirmAlert();
    });
  }

  ngOnDestroy() {
    if (this.backButtonSubscription) {
      this.backButtonSubscription.unsubscribe();
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  validarNombreCompleto(nombre: string): string[] {
    const errores: string[] = [];
    const palabras = nombre.trim().split(' ');

    if (palabras.length !== 2) {
      errores.push('El nombre completo debe contener solo dos palabras (nombre y apellido).');
    }

    if (!palabras[0] || !/^[A-Z][a-z]*$/.test(palabras[0])) {
      errores.push('El nombre debe comenzar con una letra mayúscula.');
    }

    if (!palabras[1] || !/^[A-Z][a-z]*$/.test(palabras[1])) {
      errores.push('El apellido debe comenzar con una letra mayúscula.');
    }

    return errores;
  }

  validarUsuario(usuario: string): string[] {
    const errores: string[] = [];
    const regexLongitud = /^[A-Za-z0-9]{8,13}$/;
    const regexMinusculas = /^[a-z0-9]+$/;

    if (!regexLongitud.test(usuario)) {
      errores.push('El usuario debe tener entre 8 y 13 caracteres.');
    }

    if (!regexMinusculas.test(usuario)) {
      errores.push('El usuario no debe tener letras mayúsculas.');
    }

    if (/\s/.test(usuario)) {
      errores.push('El usuario no debe tener espacios.');
    }

    if (this.usuarioService.getUsuario(usuario)) {
      errores.push('El nombre de usuario ya existe. Por favor, elige otro nombre.');
    }

    return errores;
  }

  validarCorreo(correo: string): string[] {
    const errores: string[] = [];
    const regexFormato = /^[a-zA-Z0-9._%+-]+@(gmail\.com|hotmail\.com|outlook\.com|uce\.edu\.ec)$/;
  
    if (!correo.includes('@')) {
      errores.push('El correo debe contener @.');
    }
  
    if (!regexFormato.test(correo)) {
      errores.push('El correo debe ser de gmail, hotmail, outlook o uce.edu.ec.');
    }
  
    return errores;
  }
 // Metodo que vamos a editar para las validaciones en el formularios de registro S
  validarContrasena(contrasena: string): string[] {
    const errores: string[] = [];

    // Vaidar si se tiene 8 carateres de longitud 
    if (contrasena.length !== 8) {
        errores.push('La contraseña debe tener exactamente 8 caracteres.');
    }

    // Validar que no se tengan mas de los letras mayusculasS
    const uppercaseCount = (contrasena.match(/[A-Z]/g) || []).length;
    if (uppercaseCount < 2) {
        errores.push('La contraseña debe contener al menos 2 mayúsculas.');
    }

    //Validar que no se tengan mas de tres minusculas
    const lowercaseCount = (contrasena.match(/[a-z]/g) || []).length;
    if (lowercaseCount > 3) {
        errores.push('La contraseña debe contener máximo 3 minúsculas.');
    }

    // Validar que no tengamos mas de 3 numeros de 0 al 9
    const numberCount = (contrasena.match(/[0-9]/g) || []).length;
    if (numberCount !== 3) {
        errores.push('La contraseña debe contener exactamente 3 números.');
    }

    // Tener los caracteres especiales 
    if (/[#@_|]$/.test(contrasena)) {
        errores.push('La contraseña debe terminar con uno de los siguientes caracteres: #@_i|');
    }

    return errores;
}

  validateForm() {
    this.nombreCompletoError = '';
    this.usuarioError = '';
    this.correoError = '';
    this.contrasenaError = '';

    const nombreErrores = this.nombreCompleto ? this.validarNombreCompleto(this.nombreCompleto) : [];
    if (nombreErrores.length > 0) {
      this.nombreCompletoError = nombreErrores.join(' ');
    }

    const usuarioErrores = this.usuario ? this.validarUsuario(this.usuario) : [];
    if (usuarioErrores.length > 0) {
      this.usuarioError = usuarioErrores.join(' ');
    }

    const correoErrores = this.correo ? this.validarCorreo(this.correo) : [];
    if (correoErrores.length > 0) {
      this.correoError = correoErrores.join(' ');
    }

    const contrasenaErrores = this.contrasena ? this.validarContrasena(this.contrasena) : [];
    if (contrasenaErrores.length > 0) {
      this.contrasenaError = contrasenaErrores.join(' ');
    }
  }

  register() {
    console.log('Intentando registrar usuario...');
    this.validateForm();
    if (!this.nombreCompletoError && !this.usuarioError && !this.correoError && !this.contrasenaError && this.nombreCompleto && this.usuario && this.correo && this.contrasena) {
      const [nombre, apellido] = this.nombreCompleto.split(' ');
      const hashContrasenia = this.usuarioService.hashContrasenia(this.contrasena);
      const imagenes = ['assets/img/p-1.png', 'assets/img/p-2.png', 'assets/img/p-3.png', 'assets/img/p-4.png'];
      const imagen = imagenes[Math.floor(Math.random() * imagenes.length)];

      const nuevoUsuario: Usuario = {
        usuario: this.usuario,
        nombre: nombre,
        apellido: apellido,
        contrasenia: hashContrasenia,
        imagen: imagen,
        correo: this.correo
      };

      this.usuarioService.agregarUsuario(nuevoUsuario);

      this.router.navigate(['/login'], { state: { message: 'Registro exitoso' } });
      this.presentToast('Registro exitoso, bienvendio a la aplicación.');
      this.mensajeExito = 'Registro exitoso, bienvendio a la aplicación.';
      console.log('Usuario registrado con éxito:', nuevoUsuario);
    } else {
      this.presentToast('Error en el registro. Por favor, verifica los datos ingresados.');
    }
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom',
      cssClass: 'custom-toast'
    });
    toast.present();
  }

  goBack() {
    this.showConfirmAlert();
  }

  showConfirmAlert() {
    this.isAlertOpen = true;
  }

  cancelAlert() {
    this.isAlertOpen = false;
  }

  backLogin() {
    this.isAlertOpen = false;
    this.presentToast('Se cancelo su registro.');
    this.router.navigate(['/login']);
  }
}