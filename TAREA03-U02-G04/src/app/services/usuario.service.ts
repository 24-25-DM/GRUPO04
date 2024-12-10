import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { Usuario } from '../models/usuario.model';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private usuarios: Usuario[] = [
    {
      usuario: 'fatima',
      nombre: 'Fátima',
      apellido: 'Fiallos',
      contrasenia: 'dfd8e2346c070722311ea41e2a44e29a44dfadb0250651bc8a7e895e3af90948',
      imagen: 'assets/img/p-1.png',
      correo: 'fatima@example.com'
    }, 
    {
      usuario: 'leonardo',
      nombre: 'Leonardo',
      apellido: 'Ramírez',
      contrasenia: 'daa1ca90a18bcf94622b29f74c7c4a9baf94d4ebd29163eff0fd1bedd5339d5d',
      imagen: 'assets/img/p-2.png',
      correo: 'leonardo@example.com'
    },
    {
      usuario: 'pablo',
      nombre: 'Pablo',
      apellido: 'Simbaña',
      contrasenia: 'b84225cfa8252b533d242cd6ee682739e9e29ee6f5ec9a36f5a7feff2fa95b2d',
      imagen: 'assets/img/p-3.png',
      correo: 'pablo@example.com'
    },
    {
      usuario: 'edlith',
      nombre: 'Edlith',
      apellido: 'Vinueza',
      contrasenia: 'd3ca1b6dd2e49bd709bd915568525699441a4245f523fc4af869b9e5771ff300',
      imagen: 'assets/img/p-4.png',
      correo: 'edlith@example.com'
    }
  ];

  private usuarioAutenticado: Usuario | null = null;

  constructor(private storage: Storage) {
    this.initializeStorage();
  }

  async initializeStorage() {
    await this.storage.create();
    this.usuarioAutenticado = await this.storage.get('usuarioAutenticado');
  }

  hashContrasenia(contrasenia: string): string {
    return CryptoJS.SHA256(contrasenia).toString();
  }

  async verificarUsuario(usuario: string, contrasenia: string): Promise<boolean> {
    const usuarioEncontrado = this.usuarios.find(u => u.usuario === usuario && u.contrasenia === this.hashContrasenia(contrasenia));
    if (usuarioEncontrado) {
      this.usuarioAutenticado = usuarioEncontrado;
      await this.storage.set('usuarioAutenticado', this.usuarioAutenticado);
      return true;
    }
    return false;
  }

  obtenerUsuarioAutenticado(): Usuario | null {
    return this.usuarioAutenticado;
  }

  async cerrarSesion(): Promise<void> {
    this.usuarioAutenticado = null;
    await this.storage.remove('usuarioAutenticado');
  }

  async guardarSesion(): Promise<void> {
    if (this.usuarioAutenticado) {
      await this.storage.set('usuarioAutenticado', this.usuarioAutenticado);
    }
  }

  getUsuarios(): Usuario[] {
    return this.usuarios;
  }

  getUsuario(usuario: string): Usuario | undefined {
    return this.usuarios.find(u => u.usuario === usuario);
  }

  agregarUsuario(usuario: Usuario): void {
    this.usuarios.push(usuario);
  }

  usuarioYaExiste(usuario: string): boolean {
    return this.usuarios.some(u => u.usuario === usuario);
  }
}