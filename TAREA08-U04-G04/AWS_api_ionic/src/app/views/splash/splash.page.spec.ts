import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SplashPage } from '../../controllers/splash/splash.page';
// Verificar que el componente SplashPage puede ser creado exitosamente.
describe('SplashPage', () => {
  let component: SplashPage;
  let fixture: ComponentFixture<SplashPage>;
//Configura el entorno de prueba 
  beforeEach(() => {
    fixture = TestBed.createComponent(SplashPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
