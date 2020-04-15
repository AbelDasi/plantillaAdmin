import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcronimosComponent } from './acronimos.component';

describe('AcronimosComponent', () => {
  let component: AcronimosComponent;
  let fixture: ComponentFixture<AcronimosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcronimosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcronimosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
