// src/app/app.component.ts
import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { Capacitor } from '@capacitor/core';
import { Filesystem } from '@capacitor/filesystem';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private router: Router
  ) {
    this.initializeApp();
  }

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
      await this.requestPermissions();
    });
  }

  async requestPermissions() {
    if (Capacitor.isNativePlatform()) {
      try {
        const permissions = await Filesystem.requestPermissions();
        console.log('Permissions granted:', permissions);
      } catch (error) {
        console.error('Error requesting permissions:', error);
      }
    }
  }
}