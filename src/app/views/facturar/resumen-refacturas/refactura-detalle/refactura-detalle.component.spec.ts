import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RefacturaDetalleComponent } from './refactura-detalle.component';

describe('RefacturaDetalleComponent', () => {
  let component: RefacturaDetalleComponent;
  let fixture: ComponentFixture<RefacturaDetalleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RefacturaDetalleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RefacturaDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
