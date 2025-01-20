import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VehiclesPageRoutingModule } from './vehicles-routing.module';

import { VehiclesPage } from '../../controllers/vehicles/vehicles.page';
//Configuración para el enrutamiento de la vista de los vehículos disponibles
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VehiclesPageRoutingModule
  ],
  declarations: [VehiclesPage]
})
export class VehiclesPageModule {}
