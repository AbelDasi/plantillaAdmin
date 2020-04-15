import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrefacturaDetalleComponent } from './prefactura-detalle.component';

describe('PrefacturaDetalleComponent', () => {
  let component: PrefacturaDetalleComponent;
  let fixture: ComponentFixture<PrefacturaDetalleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrefacturaDetalleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrefacturaDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
