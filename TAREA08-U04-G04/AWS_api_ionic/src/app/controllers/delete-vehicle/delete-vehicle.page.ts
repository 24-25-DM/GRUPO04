import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
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
    private apiService: ApiService,
    private router: Router,
    private platform: Platform,
    private toastController: ToastController
  ) {}

  // Enlista los vehículos en el sistema
  async ngOnInit() {
    await this.loadVehicles();

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
  async loadVehicles() {
    try {
      this.vehicles = await this.apiService.getVehicles();
      this.vehicles.forEach(vehicle => {
        if (!vehicle.fotoUrl) {
          vehicle.fotoUrl = 'assets/img/logo.png'; // Imagen predeterminada
        }
      });
    } catch (error) {
      console.error('Error al cargar vehículos:', error);
      await this.presentToast('Error al cargar vehículos. Por favor, intente nuevamente.');
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
  async confirmHideVehicle() {
    if (this.placaToDelete) {
      await this.hideVehicle(this.placaToDelete);
      this.isAlertOpen = false;
      this.placaToDelete = null;
    }
  }

  // Ocultar un vehículo
  async hideVehicle(placa: string) {
    try {
      await this.apiService.deleteVehicle(placa);
      await this.loadVehicles(); // Actualiza la lista de vehículos
      this.presentToast('Vehículo eliminado con éxito');
    } catch (error) {
      console.error('Error al eliminar vehículo:', error);
      await this.presentToast('Error al eliminar el vehículo. Por favor, intente nuevamente.');
    }
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
    this.presentToast('Se elimino correctamente el automovil.');
    this.confirmHideVehicle();
  }
  
  // Método para manejar errores de carga de imágenes
  onImageError(event: Event) {
    const element = event.target as HTMLImageElement;
    element.src = 'assets/img/logo.png'; // Ruta a una imagen por defecto
  }
}