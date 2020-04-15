import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RefacturasComponent } from './refacturas.component';

describe('RefacturasComponent', () => {
  let component: RefacturasComponent;
  let fixture: ComponentFixture<RefacturasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RefacturasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RefacturasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
