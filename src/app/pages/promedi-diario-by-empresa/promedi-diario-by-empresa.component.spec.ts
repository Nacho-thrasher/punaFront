import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromediDiarioByEmpresaComponent } from './promedi-diario-by-empresa.component';

describe('PromediDiarioByEmpresaComponent', () => {
  let component: PromediDiarioByEmpresaComponent;
  let fixture: ComponentFixture<PromediDiarioByEmpresaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PromediDiarioByEmpresaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PromediDiarioByEmpresaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
