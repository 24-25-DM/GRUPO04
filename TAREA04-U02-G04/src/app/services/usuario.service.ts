import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { Usuario } from '../models/usuario.model';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private usuarios: Usuario[] = [];
  private usuarioAutenticado: Usuario | null = null;
  private readonly fileName = 'usuarios.json';

  constructor() {
    this.requestPermissions().then(() => {
      this.loadUsuarios();
    }).catch(error => {
      console.error('Permissions not granted', error);
    });
  }

  private async requestPermissions() {
    if (Capacitor.isNativePlatform()) {
      const permissions = await Filesystem.requestPermissions();
      if (permissions.publicStorage !== 'granted') {
        throw new Error('Permissions not granted');
      }
    }
  }

  private async loadUsuarios() {
    try {
      console.log('Intentando cargar usuarios desde el archivo...');
      const result = await Filesystem.readFile({
        path: this.fileName,
        directory: Directory.Documents,
        encoding: Encoding.UTF8,
      });
      if (typeof result.data === 'string') {
        this.usuarios = JSON.parse(result.data);
        console.log('Usuarios cargados:', this.usuarios);
      } else {
        throw new Error('File content is not a valid string');
      }
    } catch (error: any) {
      if (error.message.includes('File does not exist')) {
        // Si el archivo no existe, inicializar con datos predeterminados
        console.log('Archivo no encontrado, creando usuarios predeterminados...');
        this.usuarios = [
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
        await this.saveUsuarios();
        console.log('Archivo usuarios.json creado con datos predeterminados.');
      } else {
        console.error('Error loading usuarios:', error);
      }
    }
  }

  private async saveUsuarios() {
    try {
      const fileContent = JSON.stringify(this.usuarios);
      await Filesystem.writeFile({
        path: this.fileName,
        data: fileContent,
        directory: Directory.Documents,
        encoding: Encoding.UTF8,
      });
      console.log('Archivo usuarios.json guardado correctamente.');
    } catch (error) {
      console.error('Error saving usuarios:', error);
    }
  }

  hashContrasenia(contrasenia: string): string {
    return CryptoJS.SHA256(contrasenia).toString();
  }

  verificarUsuario(usuario: string, contrasenia: string): boolean {
    const usuarioEncontrado = this.usuarios.find(u => u.usuario === usuario && u.contrasenia === this.hashContrasenia(contrasenia));
    if (usuarioEncontrado) {
      this.usuarioAutenticado = usuarioEncontrado;
      return true;
    }
    return false;
  }

  obtenerUsuarioAutenticado(): Usuario | null {
    return this.usuarioAutenticado;
  }

  cerrarSesion(): void {
    this.usuarioAutenticado = null;
  }

  getUsuarios(): Usuario[] {
    return this.usuarios;
  }

  getUsuario(usuario: string): Usuario | undefined {
    return this.usuarios.find(u => u.usuario === usuario);
  }

  async agregarUsuario(usuario: Usuario): Promise<void> {
    this.usuarios.push(usuario);
    await this.saveUsuarios();
  }

  usuarioYaExiste(usuario: string): boolean {
    return this.usuarios.some(u => u.usuario === usuario);
  }
}