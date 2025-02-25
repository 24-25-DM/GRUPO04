import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UpdateVehiculoPageRoutingModule } from './update-vehiculo-routing.module';

import { UpdateVehiculoPage } from '../../controllers/update-vehicle/update-vehiculo.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UpdateVehiculoPageRoutingModule
  ],
  declarations: [UpdateVehiculoPage]
})
export class UpdateVehiculoPageModule {}
