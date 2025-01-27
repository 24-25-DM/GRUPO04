import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Device } from '@capacitor/device';
import { CapacitorSQLite, capSQLiteChanges, capSQLiteValues, JsonSQLite } from '@capacitor-community/sqlite';
import { Preferences } from '@capacitor/preferences';
import { HttpClient } from '@angular/common/http';
import { Vehicle } from '../models/vehicle.model';
import { Usuario } from '../models/usuario.model'; // Assuming you have a User model
import { first } from 'rxjs/operators';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SqliteService {
  public dbReady: BehaviorSubject<boolean>
  public isWeb: boolean;
  public isIOS: boolean;
  public dbName: string;
  private vehicles: Vehicle[] = [
    {
      placa: 'ABC123',
      marca: 'Toyota',
      fecFabricacion: '2020-01-01',
      color: 'blanco',
      costo: 20000,
      activo: true,
      oculto: false,
      fotoUrl: 'assets/img/toyotablanco.jpg'
    },
    {
      placa: 'DEF456',
      marca: 'Honda',
      fecFabricacion: '2019-05-15',
      color: 'negro',
      costo: 18000,
      activo: true,
      oculto: false,
      fotoUrl: 'assets/img/hondanegro.jpg'
    },
    {
      placa: 'GHI789',
      marca: 'Ford',
      fecFabricacion: '2018-08-20',
      color: 'azul',
      costo: 22000,
      activo: true,
      oculto: false,
      fotoUrl: 'assets/img/fordazul.jpg'
    }
  ];
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

  constructor(
    private http: HttpClient
  ) {
    this.dbReady = new BehaviorSubject(false);
    this.isWeb = false;
    this.isIOS = false;
    this.dbName = '';
  }

  async init() {
    const info = await Device.getInfo();
    const sqlite = CapacitorSQLite as any;

    if (info.platform == 'android') {
      try {
        await sqlite.requestPermissions();
      } catch (error) {
        console.error("Esta app necesita permisos para funcionar")
      }

    } else if (info.platform == 'web') {
      this.isWeb = true;
      await sqlite.initWebStore();

    } else if (info.platform == 'ios') {
      this.isIOS = true;
    }
    await this.setupdatabase();
    await this.printTableColumns();
    await this.printVehicles();
    await this.printUsers();
  }

  async setupdatabase() {
    const dbSetup = await Preferences.get({ key: 'first_setup_key' });
    if (!dbSetup.value) {
      await this.downloadDatabase();
    } else {
      this.dbName = await this.getDbName();

      await CapacitorSQLite.createConnection({ database: this.dbName });
      await CapacitorSQLite.open({ database: this.dbName });
      console.log(`Database connection opened setupdatabase(): ${this.dbName}`);
      this.dbReady.next(true);
    }
  }

  async downloadDatabase() {
    try {
      const jsonExport: JsonSQLite = await firstValueFrom(this.http.get<JsonSQLite>('assets/data/db.json'));
      const jsonstring = JSON.stringify(jsonExport);
      const isValid = await CapacitorSQLite.isJsonValid({ jsonstring });
      if (isValid.result) {
        this.dbName = jsonExport.database;
        await CapacitorSQLite.importFromJson({ jsonstring });
        await CapacitorSQLite.createConnection({ database: this.dbName });
        await CapacitorSQLite.open({ database: this.dbName });
        console.log(`Database connection opened downloadDatabase(): ${this.dbName}`);
      }

      await Preferences.set({ key: 'first_setup_key', value: '1' });
      await Preferences.set({ key: 'dbname', value: this.dbName });

      this.dbReady.next(true);
      await this.insertInitialVehicles(); // Ensure vehicles are inserted after database setup
      await this.insertInitialUsers(); // Ensure users are inserted after database setup
    } catch (error) {
      console.error('Error downloading database:', error);
    }
  }

  async getDbName() {
    if (!this.dbName) {
      const dbname = await Preferences.get({ key: 'dbname' });
      if (dbname.value) {
        this.dbName = dbname.value;
      }
    }
    return this.dbName;
  }

  async createVehicle(vehicle: Vehicle) {
    await firstValueFrom(this.dbReady.pipe(first(isReady => isReady))); // Espera a que la base de datos esté lista
    let sql = 'INSERT INTO vehicles (placa, marca, fecFabricacion, color, costo, activo, oculto, fotoUrl) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    const dbName = await this.getDbName();
    return CapacitorSQLite.executeSet({
      database: dbName,
      set: [
        {
          statement: sql,
          values: [
            vehicle.placa,
            vehicle.marca,
            vehicle.fecFabricacion,
            vehicle.color,
            vehicle.costo,
            vehicle.activo,
            vehicle.oculto,
            vehicle.fotoUrl
          ]
        }
      ]
    }).then((changes: capSQLiteChanges) => {
      console.log(`Vehicle ${vehicle.placa} inserted`);
      if (this.isWeb) {
        CapacitorSQLite.saveToStore({ database: dbName });
      }
      return changes;
    }).catch(err => {
      console.error(`Error inserting vehicle ${vehicle.placa}:`, err);
      return Promise.reject(err);
    });
  }

  async readVehicle() {
    await firstValueFrom(this.dbReady.pipe(first(isReady => isReady))); // Espera a que la base de datos esté lista
    let sql = 'SELECT * FROM vehicles';
    const dbName = await this.getDbName();
    return CapacitorSQLite.query({
      database: dbName,
      statement: sql,
      values: []
    }).then((response: capSQLiteValues) => {
      let vehicles: Vehicle[] = [];
      if (this.isIOS && response.values.length > 0) {
        response.values.shift();
      }

      for (let index = 0; index < response.values.length; index++) {
        const vehicle = response.values[index];
        vehicles.push({
          placa: vehicle.placa,
          marca: vehicle.marca,
          fecFabricacion: vehicle.fecFabricacion,
          color: vehicle.color,
          costo: vehicle.costo,
          activo: vehicle.activo,
          oculto: vehicle.oculto,
          fotoUrl: vehicle.fotoUrl // Asegúrate de incluir fotoUrl aquí
        });
      }
      console.log('Vehicles read:', vehicles);
      return vehicles;
    }).catch(err => {
      console.error('Error reading vehicles:', err);
      return Promise.reject(err);
    });
  }

  async updateVehicle(updatedVehicle: Vehicle) {
    await firstValueFrom(this.dbReady.pipe(first(isReady => isReady))); // Espera a que la base de datos esté lista
    let sql = 'UPDATE vehicles SET marca = ?, fecFabricacion = ?, color = ?, costo = ?, activo = ?, oculto = ?, fotoUrl = ? WHERE placa = ?';
    const dbName = await this.getDbName();
    return CapacitorSQLite.executeSet({
      database: dbName,
      set: [
        {
          statement: sql,
          values: [
            updatedVehicle.marca,
            updatedVehicle.fecFabricacion,
            updatedVehicle.color,
            updatedVehicle.costo,
            updatedVehicle.activo,
            updatedVehicle.oculto,
            updatedVehicle.fotoUrl,
            updatedVehicle.placa
          ]
        }
      ]
    }).then((changes: capSQLiteChanges) => {
      console.log(`Vehicle ${updatedVehicle.placa} updated`);
      if (this.isWeb) {
        CapacitorSQLite.saveToStore({ database: dbName });
      }
      return changes;
    }).catch(err => {
      console.error(`Error updating vehicle ${updatedVehicle.placa}:`, err);
      return Promise.reject(err);
    });
  }

  async deleteVehicle(placa: string) {
    await firstValueFrom(this.dbReady.pipe(first(isReady => isReady))); // Espera a que la base de datos esté lista
    let sql = 'DELETE FROM vehicles WHERE placa = ?';
    const dbName = await this.getDbName();
    return CapacitorSQLite.executeSet({
      database: dbName,
      set: [
        {
          statement: sql,
          values: [
            placa
          ]
        }
      ]
    }).then((changes: capSQLiteChanges) => {
      console.log(`Vehicle ${placa} deleted`);
      if (this.isWeb) {
        CapacitorSQLite.saveToStore({ database: dbName });
      }
      return changes;
    }).catch(err => {
      console.error(`Error deleting vehicle ${placa}:`, err);
      return Promise.reject(err);
    });
  }

  async insertInitialVehicles() {
    for (const vehicle of this.vehicles) {
      await this.createVehicle(vehicle);
    }
  }

  async insertInitialUsers() {
    for (const user of this.usuarios) {
      await this.createUser(user);
    }
  }

  async createUser(user: Usuario) {
    await firstValueFrom(this.dbReady.pipe(first(isReady => isReady))); // Espera a que la base de datos esté lista
    let sql = 'INSERT INTO users (usuario, nombre, apellido, contrasenia, imagen, correo) VALUES (?, ?, ?, ?, ?, ?)';
    const dbName = await this.getDbName();
    return CapacitorSQLite.executeSet({
      database: dbName,
      set: [
        {
          statement: sql,
          values: [
            user.usuario,
            user.nombre,
            user.apellido,
            user.contrasenia,
            user.imagen,
            user.correo
          ]
        }
      ]
    }).then((changes: capSQLiteChanges) => {
      console.log(`User ${user.usuario} inserted`);
      if (this.isWeb) {
        CapacitorSQLite.saveToStore({ database: dbName });
      }
      return changes;
    }).catch(err => {
      console.error(`Error inserting user ${user.usuario}:`, err);
      return Promise.reject(err);
    });
  }

  async readUsers() {
    await firstValueFrom(this.dbReady.pipe(first(isReady => isReady))); // Espera a que la base de datos esté lista
    let sql = 'SELECT * FROM users';
    const dbName = await this.getDbName();
    return CapacitorSQLite.query({
      database: dbName,
      statement: sql,
      values: []
    }).then((response: capSQLiteValues) => {
      let users: Usuario[] = [];
      if (this.isIOS && response.values.length > 0) {
        response.values.shift();
      }

      for (let index = 0; index < response.values.length; index++) {
        const user = response.values[index];
        users.push(user);
      }
      console.log('Users read:', users);
      return users;
    }).catch(err => {
      console.error('Error reading users:', err);
      return Promise.reject(err);
    });
  }

  async updateUser(updatedUser: Usuario) {
    await firstValueFrom(this.dbReady.pipe(first(isReady => isReady))); // Espera a que la base de datos esté lista
    let sql = 'UPDATE users SET nombre = ?, apellido = ?, contrasenia = ?, imagen = ?, correo = ? WHERE usuario = ?';
    const dbName = await this.getDbName();
    return CapacitorSQLite.executeSet({
      database: dbName,
      set: [
        {
          statement: sql,
          values: [
            updatedUser.nombre,
            updatedUser.apellido,
            updatedUser.contrasenia,
            updatedUser.imagen,
            updatedUser.correo,
            updatedUser.usuario
          ]
        }
      ]
    }).then((changes: capSQLiteChanges) => {
      console.log(`User ${updatedUser.usuario} updated`);
      if (this.isWeb) {
        CapacitorSQLite.saveToStore({ database: dbName });
      }
      return changes;
    }).catch(err => {
      console.error(`Error updating user ${updatedUser.usuario}:`, err);
      return Promise.reject(err);
    });
  }

  async deleteUser(usuario: string) {
    await firstValueFrom(this.dbReady.pipe(first(isReady => isReady))); // Espera a que la base de datos esté lista
    let sql = 'DELETE FROM users WHERE usuario = ?';
    const dbName = await this.getDbName();
    return CapacitorSQLite.executeSet({
      database: dbName,
      set: [
        {
          statement: sql,
          values: [usuario]
        }
      ]
    }).then((changes: capSQLiteChanges) => {
      console.log(`User ${usuario} deleted`);
      if (this.isWeb) {
        CapacitorSQLite.saveToStore({ database: dbName });
      }
      return changes;
    }).catch(err => {
      console.error(`Error deleting user ${usuario}:`, err);
      return Promise.reject(err);
    });
  }

  async readUserByCredentials(usuario: string, contrasenia: string) {
    await firstValueFrom(this.dbReady.pipe(first(isReady => isReady))); // Espera a que la base de datos esté lista
    let sql = 'SELECT * FROM users WHERE usuario = ? AND contrasenia = ?';
    const dbName = await this.getDbName();
    return CapacitorSQLite.query({
      database: dbName,
      statement: sql,
      values: [usuario, contrasenia]
    }).then((response: capSQLiteValues) => {
      if (response.values.length > 0) {
        console.log(`User ${usuario} read by credentials`);
        return response.values[0];
      } else {
        console.log(`No user found with credentials for ${usuario}`);
        return null;
      }
    }).catch(err => {
      console.error(`Error reading user by credentials for ${usuario}:`, err);
      return Promise.reject(err);
    });
  }

  async readUserByUsuario(usuario: string) {
    await firstValueFrom(this.dbReady.pipe(first(isReady => isReady))); // Espera a que la base de datos esté lista
    let sql = 'SELECT * FROM users WHERE usuario = ?';
    const dbName = await this.getDbName();
    return CapacitorSQLite.query({
      database: dbName,
      statement: sql,
      values: [usuario]
    }).then((response: capSQLiteValues) => {
      if (response.values.length > 0) {
        console.log(`User ${usuario} read by usuario`);
        return response.values[0];
      } else {
        console.log(`No user found with usuario ${usuario}`);
        return null;
      }
    }).catch(err => {
      console.error(`Error reading user by usuario ${usuario}:`, err);
      return Promise.reject(err);
    });
  }

  async printTableColumns() {
    const dbName = await this.getDbName();
    const tables = await CapacitorSQLite.query({
      database: dbName,
      statement: "SELECT name FROM sqlite_master WHERE type='table'",
      values: []
    });

    for (const table of tables.values) {
      const columns = await CapacitorSQLite.query({
        database: dbName,
        statement: `PRAGMA table_info(${table.name})`,
        values: []
      });
      console.log(`Table: ${table.name}`);
      columns.values.forEach(column => {
        console.log(`Column: ${column.name}, Type: ${column.type}`);
      });
    }
  }

  async printVehicles() {
    const vehicles = await this.readVehicle();
    console.log('Vehicles:', vehicles);
  }

  async printUsers() {
    const users = await this.readUsers();
    console.log('Users:', users);
  }

  async executeQuery(sqlQuery: string) {
    await firstValueFrom(this.dbReady.pipe(first(isReady => isReady))); // Espera a que la base de datos esté lista
    const dbName = await this.getDbName();
    return CapacitorSQLite.query({
      database: dbName,
      statement: sqlQuery,
      values: []
    }).then((response: capSQLiteValues) => {
      console.log('Query executed:', sqlQuery);
      return response.values;
    }).catch(err => {
      console.error('Error ejecutando la consulta:', err);
      throw err;
    });
  }
}