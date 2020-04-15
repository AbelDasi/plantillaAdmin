import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrefacturaComponent } from './prefactura.component';

describe('PrefacturaComponent', () => {
  let component: PrefacturaComponent;
  let fixture: ComponentFixture<PrefacturaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrefacturaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrefacturaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
