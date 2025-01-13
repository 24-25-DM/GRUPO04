// src/app/app.component.ts
import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private router: Router
  ) {
    this.initializeApp();
  }
//Se identifica si la aplicación se ejecuta en un dispositivo móvil o en un navegador.
  initializeApp() {
    this.platform.ready().then(() => {
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
    });
  }
}