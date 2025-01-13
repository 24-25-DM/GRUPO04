import { Injectable } from "@angular/core";
import { Vehicle } from '../models/vehicle.model';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';

@Injectable({
    providedIn: "root"
})
export class VehicleService {
    private vehicles: Vehicle[] = [];
    private readonly fileName = 'vehicles.json';

    constructor() {
        this.requestPermissions().then(() => {
            this.loadVehicles();
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

    private async loadVehicles() {
        try {
            console.log('Intentando cargar vehículos desde el archivo...');
            const result = await Filesystem.readFile({
                path: this.fileName,
                directory: Directory.Documents,
                encoding: Encoding.UTF8,
            });
            if (typeof result.data === 'string') {
                this.vehicles = JSON.parse(result.data);
                console.log('Vehículos cargados:', this.vehicles);
            } else {
                throw new Error('File content is not a valid string');
            }
        } catch (error: any) {
            if (error.message.includes('File does not exist')) {
                // Si el archivo no existe, inicializar con datos predeterminados
                console.log('Archivo no encontrado, creando vehículos predeterminados...');
                this.vehicles = [
                    {
                        placa: 'ABC123',
                        marca: 'Toyota',
                        fecFabricacion: '2020-01-01',
                        color: 'blanco',
                        costo: 20000,
                        activo: true,
                        oculto: false
                    },
                    {
                        placa: 'DEF456',
                        marca: 'Honda',
                        fecFabricacion: '2019-05-15',
                        color: 'negro',
                        costo: 18000,
                        activo: true,
                        oculto: false
                    },
                    {
                        placa: 'GHI789',
                        marca: 'Ford',
                        fecFabricacion: '2018-08-20',
                        color: 'azul',
                        costo: 22000,
                        activo: true,
                        oculto: false
                    }
                ];
                await this.saveVehicles();
                console.log('Archivo vehicles.json creado con datos predeterminados.');
            } else {
                console.error('Error loading vehicles:', error);
            }
        }
    }

    private async saveVehicles() {
        try {
            console.log('Guardando vehículos en el archivo...');
            const fileContent = JSON.stringify(this.vehicles);
            await Filesystem.writeFile({
                path: this.fileName,
                data: fileContent,
                directory: Directory.Documents,
                encoding: Encoding.UTF8,
            });
            console.log('Archivo vehicles.json guardado correctamente.');
        } catch (error) {
            console.error('Error saving vehicles:', error);
        }
    }

    // Obtener la lista de vehículos no ocultos
    getVehicles(): Vehicle[] {
        return this.vehicles.filter(vehicle => !vehicle.oculto);
    }

    // Obtener la lista de todos los vehículos, incluidos los ocultos
    getAllVehicles(): Vehicle[] {
        return this.vehicles;
    }

    // Agregar un nuevo vehículo
    async addVehicle(vehicle: Vehicle): Promise<void> {
        this.vehicles.push(vehicle);
        await this.saveVehicles();
    }

    // Actualizar un vehículo existente
    async updateVehicle(updatedVehicle: Vehicle): Promise<void> {
        const index = this.vehicles.findIndex(vehicle => vehicle.placa === updatedVehicle.placa);
        if (index !== -1) {
            this.vehicles[index] = updatedVehicle;
            await this.saveVehicles();
        }
    }

    // Ocultar un vehículo (no eliminar)
    async deleteVehicle(placa: string): Promise<void> {
        const index = this.vehicles.findIndex(vehicle => vehicle.placa === placa);
        if (index !== -1) {
            this.vehicles[index].oculto = true;
            await this.saveVehicles();
        }
    }
}