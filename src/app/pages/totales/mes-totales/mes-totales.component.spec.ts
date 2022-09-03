import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MesTotalesComponent } from './mes-totales.component';

describe('MesTotalesComponent', () => {
  let component: MesTotalesComponent;
  let fixture: ComponentFixture<MesTotalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MesTotalesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MesTotalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
