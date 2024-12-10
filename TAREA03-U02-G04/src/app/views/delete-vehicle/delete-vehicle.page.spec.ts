import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeleteVehiclePage } from '../../controllers/delete-vehicle/delete-vehicle.page';

describe('DeleteVehiclePage', () => {
  let component: DeleteVehiclePage;
  let fixture: ComponentFixture<DeleteVehiclePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteVehiclePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
