import { Injectable } from "@angular/core";
import { Vehicle } from '../models/vehicle.model';
import { SqliteService } from '../services/sqlite.service';

@Injectable({
    providedIn: "root"
})
export class VehicleService {
    private vehicles: Vehicle[] = [];

    constructor(private sqlite: SqliteService) {}

    // Obtener la lista de vehículos no ocultos
    async getVehicles(): Promise<Vehicle[]> {
        const allVehicles = await this.sqlite.readVehicle();
        return allVehicles.filter(vehicle => !vehicle.oculto);
    }

    // Obtener la lista de todos los vehículos, incluidos los ocultos
    async getAllVehicles(): Promise<Vehicle[]> {
        return await this.sqlite.readVehicle();
    }

    // Agregar un nuevo vehículo
    async addVehicle(vehicle: Vehicle): Promise<void> {
        await this.sqlite.createVehicle(vehicle);
        this.vehicles.push(vehicle);
    }

    // Actualizar un vehículo existente
    async updateVehicle(updatedVehicle: Vehicle): Promise<void> {
        await this.sqlite.updateVehicle(updatedVehicle);
        const index = this.vehicles.findIndex(vehicle => vehicle.placa === updatedVehicle.placa);
        if (index !== -1) {
            this.vehicles[index] = updatedVehicle;
        }
    }

    // Ocultar un vehículo (no eliminar)
    async deleteVehicle(placa: string): Promise<void> {
        await this.sqlite.deleteVehicle(placa);
        const index = this.vehicles.findIndex(vehicle => vehicle.placa === placa);
        if (index !== -1) {
            this.vehicles[index].oculto = true;
        }
    }
}