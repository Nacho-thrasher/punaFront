import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComensalesComponent } from './comensales.component';

describe('ComensalesComponent', () => {
  let component: ComensalesComponent;
  let fixture: ComponentFixture<ComensalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComensalesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComensalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
