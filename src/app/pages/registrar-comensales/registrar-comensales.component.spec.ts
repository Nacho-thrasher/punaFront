import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarComensalesComponent } from './registrar-comensales.component';

describe('RegistrarComensalesComponent', () => {
  let component: RegistrarComensalesComponent;
  let fixture: ComponentFixture<RegistrarComensalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistrarComensalesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrarComensalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
