import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevaFilaComponent } from './nueva-fila.component';

describe('NuevaFilaComponent', () => {
  let component: NuevaFilaComponent;
  let fixture: ComponentFixture<NuevaFilaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NuevaFilaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NuevaFilaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
