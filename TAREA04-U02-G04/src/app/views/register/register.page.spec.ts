import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { By } from '@angular/platform-browser';
import { RegisterPage } from '../../controllers/register/register.page';

describe('RegisterPage', () => {
  let component: RegisterPage;
  let fixture: ComponentFixture<RegisterPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegisterPage],
      imports: [IonicModule.forRoot(), FormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a form with 4 input fields', () => {
    const inputElements = fixture.debugElement.queryAll(By.css('ion-input'));
    expect(inputElements.length).toBe(4);
  });

  it('should have a register button', () => {
    const buttonElement = fixture.debugElement.query(By.css('ion-button'));
    expect(buttonElement).toBeTruthy();
  });

  it('should call register method when register button is clicked', () => {
    spyOn(component, 'register');
    const buttonElement = fixture.debugElement.query(By.css('ion-button')).nativeElement;
    buttonElement.click();
    expect(component.register).toHaveBeenCalled();
  });

  it('should toggle password visibility', () => {
    component.showPassword = false;
    component.togglePasswordVisibility();
    expect(component.showPassword).toBeTrue();
    component.togglePasswordVisibility();
    expect(component.showPassword).toBeFalse();
  });
});