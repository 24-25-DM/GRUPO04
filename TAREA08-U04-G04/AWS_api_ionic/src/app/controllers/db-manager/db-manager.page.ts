import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SqliteService } from '../../services/sqlite.service';
import { Platform, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-db-manager',
  templateUrl: '../../views/db-manager/db-manager.page.html',
  styleUrls: ['../../views/db-manager/db-manager.page.scss']
})
export class DbManagerPage {
  sqlQuery: string = '';
  queryResults: any[] = [];
  queryKeys: string[] = [];
  errorMessage: string = '';
  isAlertOpen = false;
  backButtonSubscription: Subscription | undefined;

  constructor(
    private sqliteService: SqliteService, 
    private router: Router, 
    private platform: Platform, 
    private toastController: ToastController
  ) {
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.router.navigate(['/vehicles']);
    });
  }

  ngOnInit() { 
    // Suscribirse al evento del botón de regresar del celular
    this.backButtonSubscription = this.platform.backButton.subscribeWithPriority(10, () => {
      this.showConfirmAlert();
    });
  }

  ngOnDestroy() {
    // Desuscribirse del evento del botón de regresar del celular
    if (this.backButtonSubscription) {
      this.backButtonSubscription.unsubscribe();
    }
  }

  // Configuración del Toast (Mensajes a pantalla para móvil)
  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom',
      cssClass: 'custom-toast'
    });
    toast.present();
  }

  async executeQuery() {
    if (this.sqlQuery.trim() === '') {
      this.errorMessage = 'La consulta SQL no puede estar vacía.';
      return;
    }

    try {
      const response = await this.sqliteService.executeQuery(this.sqlQuery);

      if (response.length > 0) {
        this.queryResults = response;
        this.queryKeys = Object.keys(response[0]);
        this.errorMessage = '';
      } else {
        this.queryResults = [];
        this.queryKeys = [];
        this.errorMessage = 'No se encontraron resultados.';
      }
    } catch (err) {
      this.errorMessage = 'Error ejecutando la consulta: ' + err.message;
      console.error('Error ejecutando la consulta:', err);
    }
  }
  // Método para regresar a la página anterior
  goBack() {
    this.showConfirmAlert();
  }

  // Mostrar alerta de confirmación
  showConfirmAlert() {
    this.isAlertOpen = true;
  }

  // Cancelar la alerta de confirmación
  cancelAlert() {
    this.isAlertOpen = false;
  }

  // Confirmar la alerta
  backVehicles() {
    this.isAlertOpen = false;
    this.presentToast('Salio del gestor de base de datos.');
    this.router.navigate(['/vehicles']);
  }
}