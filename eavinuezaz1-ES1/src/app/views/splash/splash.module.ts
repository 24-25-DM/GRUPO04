import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SplashPageRoutingModule } from './splash-routing.module';

import { SplashPage } from '../../controllers/splash/splash.page';
//Configuración para el enrutamiento de la vista pagina de carga
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SplashPageRoutingModule
  ],
  declarations: [SplashPage]
})
export class SplashPageModule {}
