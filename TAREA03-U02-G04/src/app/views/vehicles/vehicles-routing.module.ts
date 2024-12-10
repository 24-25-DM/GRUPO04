import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VehiclesPage } from '../../controllers/vehicles/vehicles.page';

const routes: Routes = [
  {
    path: '',
    component: VehiclesPage
  }
];
//Exporta el módulo para que pueda ser utilizado por otros módulos de la aplicación.
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VehiclesPageRoutingModule {}
