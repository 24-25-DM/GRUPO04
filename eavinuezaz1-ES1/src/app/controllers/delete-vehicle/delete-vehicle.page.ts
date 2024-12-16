import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { VehicleService } from '../../services/vehicle.service';
import { Vehicle } from '../../models/vehicle.model';
import { Platform, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-delete-vehicle',
  templateUrl: '../../views/delete-vehicle/delete-vehicle.page.html',
  styleUrls: ['../../views/delete-vehicle/delete-vehicle.page.scss'],
})
export class DeleteVehiclePage implements OnInit {
  vehicles: Vehicle[] | undefined;
  isAlertOpen = false;
  isAlertBackOpen = false;
  placaToDelete: string | null = null;
  backButtonSubscription: Subscription | undefined;

  constructor(
    private vehicleService: VehicleService,
    private router: Router,
    private platform: Platform,
    private toastController: ToastController
  ) {}

  // Enlista los vehículos en el sistema
  ngOnInit() {
    this.loadVehicles();

    // Suscribirse al evento del botón de regresar del celular
    this.backButtonSubscription = this.platform.backButton.subscribeWithPriority(10, () => {
      this.showConfirmAlertBack();
    });
  }

  ngOnDestroy() {
    // Desuscribirse del evento del botón de regresar del celular
    if (this.backButtonSubscription) {
      this.backButtonSubscription.unsubscribe();
    }
  }
  // Cargar la lista de vehículos
  loadVehicles() {
    this.vehicles = this.vehicleService.getVehicles();
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

  // Método para regresar a la página anterior
  goBack() {
    this.showConfirmAlertBack();
  }

  // Mostrar alerta de confirmación
  showConfirmAlert(placa: string) {
    this.placaToDelete = placa;
    this.isAlertOpen = true;
  }

  // Cancelar la alerta de confirmación
  cancelAlert() {
    this.isAlertOpen = false;
    this.placaToDelete = null;
  }

  // Confirmar y ocultar el vehículo
  confirmHideVehicle() {
    if (this.placaToDelete) {
      this.hideVehicle(this.placaToDelete);
      this.isAlertOpen = false;
      this.placaToDelete = null;
    }
  }

  // Ocultar un vehículo
  hideVehicle(placa: string): void {
    this.vehicleService.deleteVehicle(placa);
    this.loadVehicles(); // Actualiza la lista de vehículos
    this.presentToast('Vehículo eliminado con éxito');
  }

  // Mostrar alerta de confirmación back
  showConfirmAlertBack() {
    this.isAlertBackOpen = true;
  }

  // Cancelar la alerta de confirmación back
  cancelBack() {
    this.isAlertBackOpen = false;
  }
  confirmBack() {
    this.isAlertBackOpen = false;
    this.router.navigate(['/vehicles']); 
  }

  // Confirmar la alerta back
  backVehicles() {
    this.isAlertOpen = false;
    this.presentToast('Se elimino correctamente el automivil.');
    //this.router.navigate(['/vehicles']);
    this.confirmHideVehicle();
  }
}