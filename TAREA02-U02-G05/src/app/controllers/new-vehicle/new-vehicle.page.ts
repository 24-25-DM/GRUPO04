import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { VehicleService } from '../../services/vehicle.service';
import { Vehicle } from '../../models/vehicle.model';
import { ToastController } from '@ionic/angular';

// Este es nuestro controlador de la vista new-vehicle
@Component({
  selector: 'app-new-vehicle',
  templateUrl: '../../views/new-vehicle/new-vehicle.page.html',
  styleUrls: ['../../views/new-vehicle/new-vehicle.page.scss'],
})
export class NewVehiclePage {
  isModalOpen = false;
  tempDate: string | null = null; // Temporal para el modal
  isFormSubmitted = false; // Variable para rastrear si se ha intentado enviar el formulario 
  today: string = new Date().toISOString().split('T')[0]; // Fecha actual en formato ISO
  yesterday: string = new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().split('T')[0];
  vehicle: Vehicle = {
    placa: '',
    marca: '',
    fecFabricacion: '', // Fecha final en el formulario
    color: '',
    costo: null, // Inicializa como null para que el placeholder se muestre
    activo: true
  };

  constructor(
    private vehicleService: VehicleService,
    private router: Router,
    private toastController: ToastController
  ) { }
//Metodo para agregar un vehículo
  async addVehicle() {
    this.isFormSubmitted = true; // Marcar el formulario como enviado
    if (this.isFormValid()) {
      this.vehicleService.addVehicle(this.vehicle);
      await this.presentToast('Vehículo añadido con éxito');
      this.router.navigate(['/vehicles']);
    }
  }

  // Método para mostrar el toast
  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom',
      cssClass: 'custom-toast'
    });
    toast.present();
  }

  // Abrir el modal
  openCalendarModal() {
    this.isModalOpen = true;
  }

  // Cerrar el modal
  closeCalendarModal() {
    this.isModalOpen = false;
  }

  // Método para aceptar la fecha seleccionada
  acceptDate() {
    if (this.tempDate) {
      this.vehicle.fecFabricacion = this.tempDate; // Guardar fecha seleccionada
    }
    this.closeCalendarModal(); // Cerrar modal
  }

  // Método para reiniciar el formulario
  resetForm() {
    this.vehicle = {
      placa: '',
      marca: '',
      fecFabricacion: '',
      color: '',
      costo: null, // Inicializa como null para que el placeholder se muestre
      activo: true
    };
    this.isFormSubmitted = false; // Reiniciar el estado del formulario
  }

  // Manejar cambios en el switch
  onToggleChange() {
    console.log('Estado del vehículo:', this.vehicle.activo ? 'Activo' : 'Inactivo');
  }

  isFormValid() {
    return this.vehicle.placa !== '' &&
      this.vehicle.marca !== '' &&
      this.vehicle.fecFabricacion !== '' &&
      this.vehicle.color !== '' &&
      this.vehicle.costo !== null && this.vehicle.costo > 0;
  }

  // Método para regresar a la página anterior
  goBack() {
    this.router.navigate(['/vehicles']);
  }
}