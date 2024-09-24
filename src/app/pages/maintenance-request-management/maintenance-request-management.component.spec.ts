import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintenanceRequestManagementComponent } from './maintenance-request-management.component';

describe('MaintenanceRequestManagementComponent', () => {
  let component: MaintenanceRequestManagementComponent;
  let fixture: ComponentFixture<MaintenanceRequestManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MaintenanceRequestManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaintenanceRequestManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
