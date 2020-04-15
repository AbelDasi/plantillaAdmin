import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LegislacionComponent } from './legislacion.component';

describe('LegislacionComponent', () => {
  let component: LegislacionComponent;
  let fixture: ComponentFixture<LegislacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LegislacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LegislacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
