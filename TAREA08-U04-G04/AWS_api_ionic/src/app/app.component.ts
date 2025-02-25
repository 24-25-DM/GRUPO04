import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { Device } from '@capacitor/device';
import { SqliteService } from './services/sqlite.service';
import { Network } from '@capacitor/network';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  public isWeb: boolean;
  public load: boolean;

  constructor(
    private platform: Platform,
    private router: Router,
    private sqlite: SqliteService
  ) {
    this.isWeb = false;
    this.load = false;
    this.initializeApp();
  }

  // Se identifica si la aplicación se ejecuta en un dispositivo móvil o en un navegador.
  initializeApp() {
    this.platform.ready().then(async () => {
      if (this.platform.is('cordova') || this.platform.is('capacitor')) {
        StatusBar.setStyle({ style: Style.Default });
        setTimeout(() => {
          SplashScreen.hide();
          this.router.navigateByUrl('/login');
        }, 3000); // Oculta el Splash Screen después de 3 segundos
      } else {
        // Para el navegador, redirige después de 3 segundos
        setTimeout(() => {
          this.router.navigateByUrl('/login');
        }, 3000);
      }

      const info = await Device.getInfo();
      this.isWeb = info.platform == 'web';

      this.sqlite.init();
      this.sqlite.dbReady.subscribe(load => {
        this.load = load;
      });

      // Verificar la conexión a internet
      const status = await Network.getStatus();
      if (status.connected) {
        console.log('Conectado a internet');
      } else {
        console.log('No hay conexión a internet');
      }
    });
  }
}