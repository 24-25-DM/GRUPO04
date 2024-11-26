// src/app/app-routing.module.ts
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

//configuración de las rutas de la APP
const routes: Routes = [
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
    path: 'vehicles',
    loadChildren: () => import('./views/vehicles/vehicles.module').then(m => m.VehiclesPageModule)
  },
  {
    path: 'new-vehicle',
    loadChildren: () => import('./views/new-vehicle/new-vehicle.module').then(m => m.NewVehiclePageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }