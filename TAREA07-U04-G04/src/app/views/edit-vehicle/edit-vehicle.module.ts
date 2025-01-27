import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditVehiclePageRoutingModule } from './edit-vehicle-routing.module';

import { EditVehiclePage } from '../../controllers/edit-vehicle/edit-vehicle.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditVehiclePageRoutingModule
  ],
  declarations: [EditVehiclePage]
})
export class EditVehiclePageModule {}
