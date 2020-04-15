import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DilucionesComponent } from './diluciones.component';

describe('DilucionesComponent', () => {
  let component: DilucionesComponent;
  let fixture: ComponentFixture<DilucionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DilucionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DilucionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
