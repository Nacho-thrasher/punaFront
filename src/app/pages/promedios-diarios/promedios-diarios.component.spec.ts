import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromediosDiariosComponent } from './promedios-diarios.component';

describe('PromediosDiariosComponent', () => {
  let component: PromediosDiariosComponent;
  let fixture: ComponentFixture<PromediosDiariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PromediosDiariosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PromediosDiariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
