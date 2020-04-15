import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumenAbonoComponent } from './resumen-abono.component';

describe('ResumenAbonoComponent', () => {
  let component: ResumenAbonoComponent;
  let fixture: ComponentFixture<ResumenAbonoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResumenAbonoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResumenAbonoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
