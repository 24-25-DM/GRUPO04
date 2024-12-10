import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SplashPage } from '../../controllers/splash/splash.page';

const routes: Routes = [
  {
    path: '',
    component: SplashPage
  }
];
//Exporta el módulo para que pueda ser utilizado por otros módulos de la aplicación.
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SplashPageRoutingModule {}
