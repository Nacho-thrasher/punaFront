import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaComensalesComponent } from './lista-comensales.component';

describe('ListaComensalesComponent', () => {
  let component: ListaComensalesComponent;
  let fixture: ComponentFixture<ListaComensalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListaComensalesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaComensalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
