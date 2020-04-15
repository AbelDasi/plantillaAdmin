import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevaLineaComponent } from './nueva-linea.component';

describe('NuevaLineaComponent', () => {
  let component: NuevaLineaComponent;
  let fixture: ComponentFixture<NuevaLineaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NuevaLineaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NuevaLineaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
