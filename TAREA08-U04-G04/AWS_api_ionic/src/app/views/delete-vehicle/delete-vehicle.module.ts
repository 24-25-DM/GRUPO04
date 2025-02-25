import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DeleteVehiclePageRoutingModule } from './delete-vehicle-routing.module';

import { DeleteVehiclePage } from '../../controllers/delete-vehicle/delete-vehicle.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DeleteVehiclePageRoutingModule
  ],
  declarations: [DeleteVehiclePage]
})
export class DeleteVehiclePageModule {}
