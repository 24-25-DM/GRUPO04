import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VehiclesPage } from '../../controllers/vehicles/vehicles.page';
// Verificar que el componente VehiclesPage puede ser creado exitosamente.
describe('VehiclesPage', () => {
  let component: VehiclesPage;
  let fixture: ComponentFixture<VehiclesPage>;
//Configura el entorno de prueba 
  beforeEach(() => {
    fixture = TestBed.createComponent(VehiclesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
