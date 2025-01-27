import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { Usuario } from '../models/usuario.model';
import { SqliteService } from './sqlite.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private usuarios: Usuario[] = [];

  private usuarioAutenticado: Usuario | null = null;

  constructor(private sqliteService: SqliteService) {}

  hashContrasenia(contrasenia: string): string {
    return CryptoJS.SHA256(contrasenia).toString();
  }

  async verificarUsuario(usuario: string, contrasenia: string): Promise<boolean> {
    const hashContrasenia = this.hashContrasenia(contrasenia);
    const usuarioEncontrado = await this.sqliteService.readUserByCredentials(usuario, hashContrasenia);
    if (usuarioEncontrado) {
      this.usuarioAutenticado = usuarioEncontrado;
      return true;
    }
    return false;
  }

  obtenerUsuarioAutenticado(): Usuario | null {
    return this.usuarioAutenticado;
  }

  async cerrarSesion(): Promise<void> {
    this.usuarioAutenticado = null;
  }

  async getUsuarios(): Promise<Usuario[]> {
    return await this.sqliteService.readUsers();
  }

  async getUsuario(usuario: string): Promise<Usuario | null> {
    return await this.sqliteService.readUserByUsuario(usuario);
  }

  async agregarUsuario(usuario: Usuario): Promise<void> {
    await this.sqliteService.createUser(usuario);
    this.usuarios.push(usuario);
  }

  async usuarioYaExiste(usuario: string): Promise<boolean> {
    const usuarioEncontrado = await this.sqliteService.readUserByUsuario(usuario);
    return usuarioEncontrado !== null;
  }
}