import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TyreRequestManagementComponent } from './tyre-request-management.component';

describe('TyreRequestManagementComponent', () => {
  let component: TyreRequestManagementComponent;
  let fixture: ComponentFixture<TyreRequestManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TyreRequestManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TyreRequestManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
