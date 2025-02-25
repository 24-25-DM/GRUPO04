import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { UsuarioService } from '../../services/usuario.service';
import { Vehicle } from '../../models/vehicle.model';
import { Platform, ToastController } from '@ionic/angular';
import { App } from '@capacitor/app';

@Component({
  selector: 'app-vehicles',
  templateUrl: '../../views/vehicles/vehicles.page.html',
  styleUrls: ['../../views/vehicles/vehicles.page.scss'],
})
export class VehiclesPage implements OnInit {
  private lastBackPress = 0; // Almacena el tiempo de la última vez que se presionó el botón de regresar
  private timePeriodToExit = 2000; // Tiempo en milisegundos para salir de la aplicación
  vehicles: Vehicle[] | undefined;
  user: { nombre: string, apellido: string, imagen: string } | undefined;
  isAlertOpen = false;

  constructor(
    private apiService: ApiService,
    private usuarioService: UsuarioService,
    private router: Router,
    private platform: Platform,
    private toastController: ToastController
  ) {
    this.platform.backButton.subscribeWithPriority(10, async () => {
      if (this.router.url === '/vehicles') {
        // Tiempo actual
        const currentTime = new Date().getTime();
        // Compara el tiempo actual con el tiempo de la última vez que se presionó el botón de regresar
        if (currentTime - this.lastBackPress < this.timePeriodToExit) {
          // Si el tiempo es menor a 2 segundos, se sale de la aplicación si presiono por segunda ocasión
          App.exitApp();
        } else {
          // Si el tiempo es mayor a 2 segundos, se muestra un mensaje para salir de la aplicación
          this.presentToast('Presione nuevamente para salir de la aplicación');
          this.lastBackPress = currentTime;
        }
      }
    });
  }

  // Enlista los vehículos en el sistema
  ngOnInit() {
    this.loadUserData();
  }

  // Cargar la lista de vehículos cada vez que la vista se va a mostrar
  ionViewWillEnter() {
    this.loadVehicles();
  }

  // Cargar la lista de vehículos
  async loadVehicles() {
    try {
      this.vehicles = await this.apiService.getVehicles();
      // Si algún vehículo no tiene fotoUrl, asigna una predeterminada
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

  // Visualizar la información del usuario
  async loadUserData() {
    try {
      const usuarioAutenticado = await this.usuarioService.obtenerUsuarioAutenticado();
      if (usuarioAutenticado) {
        this.user = { nombre: usuarioAutenticado.nombre, apellido: usuarioAutenticado.apellido, imagen: usuarioAutenticado.imagen };
      }
    } catch (error) {
      console.error('Error al cargar datos del usuario:', error);
      await this.presentToast('Error al cargar datos del usuario. Por favor, intente nuevamente.');
    }
  }

  // Redirecciona a la vista para agregar un nuevo vehículo
  goToNewVehicle() {
    this.router.navigate(['/new-vehicle']);
  }

  // Redirecciona a la vista para editar un vehículo
  goToEditVehicle() {
    this.router.navigate(['/edit-vehicle']);
  }

  // Redirecciona a la vista para eliminar un vehículo
  goToDeleteVehicle() {
    this.router.navigate(['/delete-vehicle']);
  }

  // Redirecciona a la vista de la Gestion de DB
  gotoDBManagement() {
    this.router.navigate(['/db-manager']);
  }

  logout() {
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
  async backLogin() {
    this.isAlertOpen = false;
    await this.usuarioService.cerrarSesion();

    // Limpiar el almacenamiento local y de sesión
    localStorage.clear();
    sessionStorage.clear();

    this.presentToast('Se cerró la sesión correctamente.');
    this.router.navigate(['/login']);
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

  // Método para manejar errores de carga de imágenes
  onImageError(event: Event) {
    const element = event.target as HTMLImageElement;
    element.src = 'assets/img/logo.png'; // Ruta a una imagen por defecto
  }
}