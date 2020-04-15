import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumenFacturaComponent } from './resumen-factura.component';

describe('ResumenFacturaComponent', () => {
  let component: ResumenFacturaComponent;
  let fixture: ComponentFixture<ResumenFacturaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResumenFacturaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResumenFacturaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
