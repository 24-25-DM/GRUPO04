import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { VehicleService } from '../../services/vehicle.service';
import { Vehicle } from '../../models/vehicle.model';
import { Platform, ToastController } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-new-vehicle',
  templateUrl: '../../views/new-vehicle/new-vehicle.page.html',
  styleUrls: ['../../views/new-vehicle/new-vehicle.page.scss'],
})
export class NewVehiclePage implements OnInit {
  isModalOpen = false;
  isAlertOpen = false;
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
    activo: true,
    oculto: false,
    fotoUrl:''
  };
  backButtonSubscription: Subscription | undefined;

  constructor(
    private vehicleService: VehicleService,
    private router: Router,
    private toastController: ToastController,
    private platform: Platform
  ) { }

  ngOnInit() {
    if (this.router.getCurrentNavigation()?.extras.state) {
      const vehicleData = this.router.getCurrentNavigation()?.extras.state?.['vehicle'] ?? null;
      if (vehicleData) {
        this.vehicle = vehicleData;
        // Formatear la fecha para que solo muestre la fecha sin la hora
        this.vehicle.fecFabricacion = this.vehicle.fecFabricacion.split('T')[0];
      }
    }

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
  async selectPhoto() {
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

  // Método para agregar un vehículo
  async addVehicle() {
  this.isFormSubmitted = true; // Marcar el formulario como enviado
  this.vehicle.placa = this.vehicle.placa.toUpperCase(); // Convertir la placa a mayúsculas
  const allVehicles = await this.vehicleService.getAllVehicles();
  const existingVehicle = allVehicles.find(v => v.placa === this.vehicle.placa);

  if (this.isFormValid()) {
    if (existingVehicle) {
      if (existingVehicle.oculto) {
        // Actualizar todos los campos del vehículo existente
        existingVehicle.marca = this.vehicle.marca;
        existingVehicle.fecFabricacion = this.vehicle.fecFabricacion;
        existingVehicle.color = this.vehicle.color;
        existingVehicle.costo = this.vehicle.costo;
        existingVehicle.activo = this.vehicle.activo;
        existingVehicle.oculto = false;
        existingVehicle.fotoUrl = this.vehicle.fotoUrl; // Actualizar la foto
        await this.vehicleService.updateVehicle(existingVehicle);
        await this.presentToast('Vehículo reactivado con éxito');
        this.resetForm();
        this.router.navigate(['/vehicles']);
      } else {
        await this.presentToast('La placa ya existe. Ingrese una placa diferente.');
      }
    } else {
      await this.vehicleService.addVehicle(this.vehicle);
      await this.presentToast('Vehículo añadido con éxito');
      this.resetForm();
      this.router.navigate(['/vehicles']);
    }
  }
}

  isFormValid() {
    return this.vehicle.placa !== '' &&
      this.isPlacaValid(this.vehicle.placa) &&
      this.isFormatPlacaValid(this.vehicle.placa) &&
      this.vehicle.marca !== '' &&
      this.vehicle.fecFabricacion !== '' &&
      this.vehicle.color !== '' &&
      this.vehicle.costo !== null && this.vehicle.costo > 0 &&
      this.vehicle.fotoUrl !== '';
  }

  /// Validacion placa formato 3 letras - 4 numeros
  isPlacaValid(placa: string): boolean {
    // Formato de placa: tres letras seguidas de cuatro números, sin permitir Q y Z al inicio
    const placaRegex = /^[A-ZÑ]{3}-\d{4}$/;
    return placaRegex.test(placa);
  }

  /// Vealidacion placa formato sin Q,Z al inicio
  isFormatPlacaValid(placa: string): boolean {
    // Formato de placa: tres letras seguidas de cuatro números, sin permitir Q y Z al inicio
    const placaRegex = /^[A-PR-Y]{1}[A-ZÑ]{2}-\d{4}$/;
    return placaRegex.test(placa);
  }

  // Validacion placa formato sin consecutivos tanto letras como numeros
  isConsecutiveFormatPlacaValid(placa: string): boolean {
    // Formato de placa: tres letras seguidas de cuatro números, sin permitir Q y Z al inicio
    return this.tieneRepetidos(placa);
  }

  tieneRepetidos(placa: string): boolean {
    // Verificar si hay letras o números consecutivos
    for (let i = 0; i < placa.length - 1; i++) {
      if (placa[i] === placa[i + 1]) {
        return true;
      }
    }
    return false;
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
      this.vehicle.fecFabricacion = this.tempDate.split('T')[0]; // Guardar solo la fecha sin la hora
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
      activo: true,
      oculto: false,
      fotoUrl:''
    };
    this.isFormSubmitted = false; // Reiniciar el estado del formulario
  }

  // Manejar cambios en el switch
  onToggleChange() {
    console.log('Estado del vehículo:', this.vehicle.activo ? 'Activo' : 'Inactivo');
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
  async backVehicles() {
    this.isAlertOpen = false;
    this.presentToast('Se cancelo la creación del vehículo.');
    this.router.navigate(['/vehicles']);
  }

  
}