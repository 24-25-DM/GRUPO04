import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewVehiclePageRoutingModule } from './new-vehicle-routing.module';

import { NewVehiclePage } from '../../controllers/new-vehicle/new-vehicle.page';
//Configuración para el enrutamiento de la vista Agregar nuevo vehículo
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NewVehiclePageRoutingModule
  ],
  declarations: [NewVehiclePage]
})
export class NewVehiclePageModule {}
