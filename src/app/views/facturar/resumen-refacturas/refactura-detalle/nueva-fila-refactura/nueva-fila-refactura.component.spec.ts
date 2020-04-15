import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevaFilaRefacturaComponent } from './nueva-fila-refactura.component';

describe('NuevaFilaRefacturaComponent', () => {
  let component: NuevaFilaRefacturaComponent;
  let fixture: ComponentFixture<NuevaFilaRefacturaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NuevaFilaRefacturaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NuevaFilaRefacturaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
