import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AbonoDetalleComponent } from './abono-detalle.component';

describe('AbonoDetalleComponent', () => {
  let component: AbonoDetalleComponent;
  let fixture: ComponentFixture<AbonoDetalleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AbonoDetalleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AbonoDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
