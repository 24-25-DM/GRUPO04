import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditVehiclePage } from '../../controllers/edit-vehicle/edit-vehicle.page';

const routes: Routes = [
  {
    path: '',
    component: EditVehiclePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditVehiclePageRoutingModule {}
