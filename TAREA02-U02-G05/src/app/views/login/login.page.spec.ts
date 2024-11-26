import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginPage } from '../../controllers/login/login.page';

// Verificar que el componente LoginPage puede ser creado exitosamente.
describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;
//Configura el entorno de prueba 
  beforeEach(() => {
    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
