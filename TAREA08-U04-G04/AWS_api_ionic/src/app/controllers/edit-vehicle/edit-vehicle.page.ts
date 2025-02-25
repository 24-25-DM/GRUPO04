import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Vehicle } from '../../models/vehicle.model';
import { Platform, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-vehicle',
  templateUrl: '../../views/edit-vehicle/edit-vehicle.page.html',
  styleUrls: ['../../views/edit-vehicle/edit-vehicle.page.scss'],
})
export class EditVehiclePage implements OnInit {
  vehicles: Vehicle[] | undefined;
  isAlertOpen = false;
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
      this.showConfirmAlert();
    });
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

  // Redirecciona a la vista para editar un vehículo
  redirectToEditVehicle(vehicle: Vehicle): void {
    const navigationExtras: NavigationExtras = {
      state: {
        vehicle: vehicle
      }
    };
    this.router.navigate(['/update-vehiculo'], navigationExtras);
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
    this.presentToast('Se cancelo la edición del vehículo.');
    this.router.navigate(['/vehicles']);
  }

  // Método para manejar errores de carga de imágenes
  onImageError(event: Event) {
    const element = event.target as HTMLImageElement;
    element.src = 'assets/img/logo.png'; // Ruta a una imagen por defecto
  }
}