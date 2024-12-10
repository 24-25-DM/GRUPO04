import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UpdateVehiculoPage } from '../../controllers/update-vehicle/update-vehiculo.page';

describe('UpdateVehiculoPage', () => {
  let component: UpdateVehiculoPage;
  let fixture: ComponentFixture<UpdateVehiculoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateVehiculoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
