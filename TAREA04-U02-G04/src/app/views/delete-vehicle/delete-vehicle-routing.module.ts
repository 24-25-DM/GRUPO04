import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DeleteVehiclePage } from '../../controllers/delete-vehicle/delete-vehicle.page';

const routes: Routes = [
  {
    path: '',
    component: DeleteVehiclePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DeleteVehiclePageRoutingModule {}
