import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiasTotalesComponent } from './dias-totales.component';

describe('DiasTotalesComponent', () => {
  let component: DiasTotalesComponent;
  let fixture: ComponentFixture<DiasTotalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiasTotalesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DiasTotalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
