import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewVehiclePage } from '../../controllers/new-vehicle/new-vehicle.page';
// Verificar que el componente NewVehiclePage puede ser creado exitosamente.
describe('NewVehiclePage', () => {
  let component: NewVehiclePage;
  let fixture: ComponentFixture<NewVehiclePage>;
//Configura el entorno de prueba 
  beforeEach(() => {
    fixture = TestBed.createComponent(NewVehiclePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
