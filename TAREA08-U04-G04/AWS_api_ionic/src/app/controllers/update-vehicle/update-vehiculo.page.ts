import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { VehicleService } from '../../services/vehicle.service';
import { Vehicle } from '../../models/vehicle.model';
import { Platform, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { ApiService } from '../../services/api.service';
@Component({
  selector: 'app-update-vehiculo',
  templateUrl: '../../views/update-vehiculo/update-vehiculo.page.html',
  styleUrls: ['../../views/update-vehiculo/update-vehiculo.page.scss'],
})
export class UpdateVehiculoPage implements OnInit {
  vehicle: Vehicle | undefined;
  initialVehicleState: Vehicle | undefined;
  isModalOpen = false;
  isAlertOpen = false;
  validback  = false;
  tempDate: string | null = null;
  isFormSubmitted = false;
  today: string = new Date().toISOString().split('T')[0];
  yesterday: string = new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().split('T')[0];
  backButtonSubscription: Subscription | undefined;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    private platform: Platform,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation()?.extras.state) {
        this.vehicle = this.router.getCurrentNavigation()?.extras.state?.['vehicle'] ?? undefined;
        if (this.vehicle) {
          // Formatear la fecha para que solo muestre la fecha sin la hora
          this.vehicle.fecFabricacion = this.vehicle.fecFabricacion.split('T')[0];
          // Guardar el estado inicial del vehículo
          this.initialVehicleState = { ...this.vehicle };
        }
      }
    });

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

  goBack() {
    this.showConfirmAlert();
  }
  async selectPhoto(): Promise<string | undefined> {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      source: CameraSource.Prompt // Permite al usuario elegir entre la cámara y la galería
    });
    this.vehicle.fotoUrl = image.webPath || '';
    console.log('Photo URL:', image.webPath);
    return image.webPath;
  }

  async updateVehicle() {
    this.isFormSubmitted = true;
    if (this.vehicle && this.isFormValid() && this.hasVehicleChanged()) {
      if (this.vehicle.fotoUrl === '') {
        await this.presentToast('Debe ingresar o tomar una foto para actualizar el vehículo.');
        return;
      }
      try {
        await this.apiService.updateVehicle(this.vehicle);
        console.log('Foto del vehículo actualizada con la URL:', this.vehicle.fotoUrl);
        await this.presentToast('Vehículo actualizado con éxito');
        this.isFormSubmitted = false;
        this.router.navigate(['/edit-vehicle']);
      } catch (error) {
        console.error('Error al actualizar vehículo:', error);
        await this.presentToast('Error al actualizar el vehículo. Por favor, intente nuevamente.');
      }
    } else {
      await this.presentToast('No se realizaron cambios en el vehículo');
    }
  }

  isFormValid() {
    return this.vehicle &&
      this.vehicle.placa !== '' &&
      this.vehicle.marca !== '' &&
      this.vehicle.fecFabricacion !== '' &&
      this.vehicle.color !== '' &&
      this.vehicle.costo !== null && this.vehicle.costo > 0 &&
      this.vehicle?.fotoUrl !== '';
  }

  hasVehicleChanged() {
    return JSON.stringify(this.vehicle) !== JSON.stringify(this.initialVehicleState);
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom',
      cssClass: 'custom-toast'
    });
    toast.present();
  }

  openCalendarModal() {
    this.isModalOpen = true;
  }

  closeCalendarModal() {
    this.isModalOpen = false;
  }

  acceptDate() {
    if (this.tempDate) {
      if (this.vehicle) {
        this.vehicle.fecFabricacion = this.tempDate.split('T')[0]; // Guardar solo la fecha sin la hora
      }
    }
    this.closeCalendarModal(); // Cerrar modal
  }

  onToggleChange() {
    console.log('Estado del vehículo:', this.vehicle?.activo ? 'Activo' : 'Inactivo');
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
    if (!this.hasVehicleChanged()) {
      this.presentToast('Se cancelo la actualización del vehículo.');
      this.router.navigate(['/edit-vehicle']);
    } else {
      this.presentToast('Por favor modificar el vehículo antes de regresar.');
    }
  }
}