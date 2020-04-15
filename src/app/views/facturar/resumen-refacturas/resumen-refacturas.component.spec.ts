import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumenRefacturasComponent } from './resumen-refacturas.component';

describe('ResumenRefacturasComponent', () => {
  let component: ResumenRefacturasComponent;
  let fixture: ComponentFixture<ResumenRefacturasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResumenRefacturasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResumenRefacturasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
