import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DbManagerPage } from '../../controllers/db-manager/db-manager.page';

describe('DbManagerPage', () => {
  let component: DbManagerPage;
  let fixture: ComponentFixture<DbManagerPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DbManagerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
