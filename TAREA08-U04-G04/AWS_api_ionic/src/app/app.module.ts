import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicStorageModule } from '@ionic/storage-angular';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
// Define el módulo principal de una aplicación Angular con Ionic
import { HttpClientModule } from '@angular/common/http'; // Importa el módulo HttpClientModule
import { defineCustomElements as jeepSqlite } from 'jeep-sqlite/loader';

import { SqliteService } from './services/sqlite.service'; // Importa SqliteService
import { ApiService } from './services/api.service'; // Importa ApiService

jeepSqlite(window);

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    IonicStorageModule.forRoot() // Inicialización de Angular y Ionic
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    SqliteService, // Añade SqliteService a los proveedores
    ApiService // Añade ApiService a los proveedores
  ],
  bootstrap: [AppComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class AppModule {}
