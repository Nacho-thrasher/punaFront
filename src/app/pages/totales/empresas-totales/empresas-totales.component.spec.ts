import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpresasTotalesComponent } from './empresas-totales.component';

describe('EmpresasTotalesComponent', () => {
  let component: EmpresasTotalesComponent;
  let fixture: ComponentFixture<EmpresasTotalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmpresasTotalesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpresasTotalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
