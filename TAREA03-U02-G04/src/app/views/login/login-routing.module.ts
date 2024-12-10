import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginPage } from '../../controllers/login/login.page';

const routes: Routes = [
  {
    path: '',
    component: LoginPage
  }
];
//Exporta el módulo para que pueda ser utilizado por otros módulos de la aplicación.
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoginPageRoutingModule {}
