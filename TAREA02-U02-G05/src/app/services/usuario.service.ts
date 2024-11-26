import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
//Credenciales de todos los integrantes del equipo
export class UsuarioService {
  private usuarios: Usuario[] = [
    {
      usuario: 'fatima',
      nombre: 'Fátima',
      apellido: 'Fiallos',
      contrasenia: this.hashContrasenia('Fiallos'),
      imagen: 'assets/img/p-1.png'
    }, 
    {
      usuario: 'leonardo',
      nombre: 'Leonardo',
      apellido: 'Ramírez',
      contrasenia: this.hashContrasenia('Ramírez'),
      imagen: 'assets/img/p-2.png'
    },
    {
      usuario: 'pablo',
      nombre: 'Pablo',
      apellido: 'Simbaña',
      contrasenia: this.hashContrasenia('Simbaña'),
      imagen: 'assets/img/p-3.png'
    },
    {
      usuario: 'edlith',
      nombre: 'Edlith',
      apellido: 'Vinueza',
      contrasenia: this.hashContrasenia('Vinueza'),
      imagen: 'assets/img/p-4.png'
    }
  ];

  private usuarioAutenticado: Usuario | null = null;

  constructor() { }

  // Crear un nuevo usuario
  agregarUsuario(usuario: string, nombre: string, apellido: string, contrasenia: string, imagen: string): void {
    const hashedContrasenia = this.hashContrasenia(contrasenia);
    this.usuarios.push({ usuario, nombre, apellido, contrasenia: hashedContrasenia, imagen });
  }

  // Verificar si el usuario y la contraseña son correctos
  verificarUsuario(usuario: string, contrasenia: string): boolean {
    const hash = this.hashContrasenia(contrasenia);
    const usuarioEncontrado = this.usuarios.find(u => 
      u.usuario === usuario && 
      u.contrasenia === hash
    );
    if (usuarioEncontrado) {
      this.usuarioAutenticado = usuarioEncontrado;
      return true;
    }
    return false;
  }

  // Obtener el usuario autenticado y existente
  obtenerUsuarioAutenticado(): Usuario | null {
    return this.usuarioAutenticado;
  }

  // Maneja el cierre de sesión del usuario autenticado
  cerrarSesion(): void {
    this.usuarioAutenticado = null;
  }

  // Método para encriptar la contraseña usando la librearía crypto-js de JavaScript "npm install crypto-js"
  public hashContrasenia(contrasenia: string): string {
    return CryptoJS.SHA256(contrasenia).toString(CryptoJS.enc.Hex);
  }
}