import { Injectable } from "@angular/core";
import { Vehicle } from '../models/vehicle.model';

@Injectable({
    providedIn: "root"
})
export class VehicleService {
    // Array con todos los posibles vehículos en el sistema
    private vehicles: Vehicle[] = [
        {
            placa: 'ABC-1235', 
            marca: 'Toyota', 
            fecFabricacion: new Date('2020-01-01').toISOString(), 
            color: 'blanco', 
            costo: 20000, 
            activo: true,
            oculto: false
        },
        {
            placa: 'DEF-4568', 
            marca: 'Honda', 
            fecFabricacion: new Date('2019-05-15').toISOString(), 
            color: 'negro', 
            costo: 18000, 
            activo: true,
            oculto: false
        },
        {
            placa: 'GHI-7890', 
            marca: 'Ford', 
            fecFabricacion: new Date('2020-07-20').toISOString(), 
            color: 'azul', 
            costo: 22000, 
            activo: true,
            oculto: false
        }
    ];

    // Obtener la lista de vehículos no ocultos
    getVehicles(): Vehicle[] {
        return this.vehicles.filter(vehicle => !vehicle.oculto);
    }

    // Obtener la lista de todos los vehículos, incluidos los ocultos
    getAllVehicles(): Vehicle[] {
        return this.vehicles;
    }

    // Agregar un nuevo vehículo
    addVehicle(vehicle: Vehicle): void {
        this.vehicles.push(vehicle);
    }

    // Actualizar un vehículo existente
    updateVehicle(updatedVehicle: Vehicle): void {
        const index = this.vehicles.findIndex(vehicle => vehicle.placa === updatedVehicle.placa);
        if (index !== -1) {
            this.vehicles[index] = updatedVehicle;
        }
    }

    // Ocultar un vehículo (no eliminar)
    deleteVehicle(placa: string): void {
        const index = this.vehicles.findIndex(vehicle => vehicle.placa === placa);
        if (index !== -1) {
            this.vehicles[index].oculto = true;
        }
    }
}