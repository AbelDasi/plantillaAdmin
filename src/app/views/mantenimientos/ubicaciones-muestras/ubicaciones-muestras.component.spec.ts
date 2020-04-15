import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UbicacionesMuestrasComponent } from './ubicaciones-muestras.component';

describe('UbicacionesMuestrasComponent', () => {
  let component: UbicacionesMuestrasComponent;
  let fixture: ComponentFixture<UbicacionesMuestrasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UbicacionesMuestrasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbicacionesMuestrasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
