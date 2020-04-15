import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgrupadosComponent } from './agrupados.component';

describe('AgrupadosComponent', () => {
  let component: AgrupadosComponent;
  let fixture: ComponentFixture<AgrupadosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgrupadosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgrupadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
