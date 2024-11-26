import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { VehicleService } from '../../services/vehicle.service';
import { UsuarioService } from '../../services/usuario.service';
import { Vehicle } from '../../models/vehicle.model';
import { Platform, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-vehicles',
  templateUrl: '../../views/vehicles/vehicles.page.html',
  styleUrls: ['../../views/vehicles/vehicles.page.scss'],
})
export class VehiclesPage implements OnInit {
  vehicles: Vehicle[] | undefined;
  user: { nombre: string, apellido: string, imagen: string } | undefined;

  constructor(
    private vehicleService: VehicleService,
    private usuarioService: UsuarioService,
    private router: Router,
    private platform: Platform,
    private toastController: ToastController
  ) {
    //Manejo de botones regresar y cerrar sesión
    this.platform.backButton.subscribeWithPriority(10, () => {
      if (this.router.url === '/vehicles') {
        console.log('Botón de regresar presionado');
        // Evita que el usuario regrese a la página de inicio cuando se presiona el botón de regresar del celular
        this.presentToast('Por favor, use el botón "Cerrar Sesión" para salir.');
      }
    });
  }
//Enlista los vehículos en el sistema
  ngOnInit() {
    this.vehicles = this.vehicleService.getVehicles();
    this.loadUserData();
  }
//Visualizar la información del usuario
  loadUserData() {
    const usuarioAutenticado = this.usuarioService.obtenerUsuarioAutenticado();
    if (usuarioAutenticado) {
      this.user = { nombre: usuarioAutenticado.nombre, apellido: usuarioAutenticado.apellido, imagen: usuarioAutenticado.imagen };
    }
  }
//Redirecciona a la vista para agregar un nuevo vehículo
  goToNewVehicle() {
    this.router.navigate(['/new-vehicle']);
  }

  logout() {
    console.log('Cerrar sesión');
    this.usuarioService.cerrarSesion();

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

  
}