// src/app/app-routing.module.ts
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

//configuración de las rutas de la APP
const routes: Routes = [
///*
  {
    path: '',
    redirectTo: 'splash',
    pathMatch: 'full'
  },
  {
    path: 'splash',
    loadChildren: () => import('./views/splash/splash.module').then(m => m.SplashPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./views/login/login.module').then(m => m.LoginPageModule)
  },

  {
    path: 'register',
    loadChildren: () => import('./views/register/register.module').then(m => m.RegisterPageModule)
  },
//*/
  {
    path: 'vehicles',
    loadChildren: () => import('./views/vehicles/vehicles.module').then(m => m.VehiclesPageModule)
  },
  {
    path: 'new-vehicle',
    loadChildren: () => import('./views/new-vehicle/new-vehicle.module').then(m => m.NewVehiclePageModule)
  },
  {
    path: 'edit-vehicle',
    loadChildren: () => import('./views/edit-vehicle/edit-vehicle.module').then( m => m.EditVehiclePageModule)
  },
  {
    path: 'update-vehiculo',
    loadChildren: () => import('./views/update-vehiculo/update-vehiculo.module').then( m => m.UpdateVehiculoPageModule)
  },
  {
    path: 'delete-vehicle',
    loadChildren: () => import('./views/delete-vehicle/delete-vehicle.module').then( m => m.DeleteVehiclePageModule)
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }